# Evil Casino — UI Overhaul Implementation Plan

Reference: [5 UI mistakes I made and the principles that fixed them](https://www.covyne.com/news/5-ui-mistakes-i-made-and-the-principles-that-fixed-them)
(hierarchy · short is sweet · first glance · recognition over decoration · consistency).

Seven phases, each shippable and testable on its own. **No balance numbers change in any phase.**

## Ground rules (all phases)

- Keep existing DOM IDs (`#money`, `#current-bet`, `#current-floor`, `#escape-goal`, `#active-upgrades`, `#history-list`, …) so JS keeps working — move elements, don't rename them.
- New HUD logic lives in **`js/game/hud.js`**, an `Object.assign(EvilCasino.prototype, {...})` extension loaded **after `game.js`, before `roguelike.js`**. When a method moves there (`updateDisplay`, `renderHistoryList`, `setupPerkTooltips`, …), delete it from `game.js` in the same commit — never two live definitions.
- Copy and icons go in `config.js`.
- Bump `?v=` in `index.html` for every edited file; add one changelog entry at the end.

---

## Phase 0 — Foundations (tokens, no visible layout change)

1. **Font-size scale** in `:root` (`style.css`):
   `--fs-xs: 0.5rem; --fs-sm: 0.6rem; --fs-md: 0.8rem; --fs-lg: 1.1rem; --fs-xl: 1.5rem; --fs-xxl: 2rem;`
   Map existing sizes: 0.3–0.55 → xs, 0.6–0.65 → sm, 0.7–0.9 → md, 1–1.2 → lg. Nothing below `--fs-xs`.
2. **Button roles**: add `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--danger` (shared padding/border/hover/disabled). Add the role classes alongside existing ones for now; Phase 5 deletes the old ones.
3. **Semantic color tokens**:
   - Rarity: `--rarity-common` (grey), `--rarity-uncommon` (blue), `--rarity-rare` (purple), `--rarity-legendary` (gold)
   - Rooms: `--room-normal/elite/shop/event/rest/treasure/gamble/boss`
   - States: `--good`, `--bad`, `--warn`
4. **Dedupe**: `.event-choice-btn` is defined twice in `style.css` — merge.

**Verify:** game looks the same, no sub-legible text; click through each popup once.

## Phase 1 — HUD hierarchy (status bar + boss rule on the table)

1. Replace in-game `<header><h1>`, `.money-display` and `.stats-bar` with one top **`#run-status-bar`**:
   `[FLOOR 3] [💀 Contract ▰▰▱ 1/2] [💰 $340 · BET $30] [perk icons…]`
   Move `#current-floor`, `#escape-goal`, `#money`, `#current-bet` into it. "LIFE SAVINGS" becomes a small label above a large money number. Keep `#legacy-wins-stat` hidden.
2. **Contract progress**: add `getContractProgress()` in `roguelike.js` → `{current, target}`; render pips. Wire the currently-missing `#contract-progress` element (`contractHudEl`).
3. **Perks** become icon-only badges in the status bar with the existing tooltip and a uses counter. Remove the bottom `.upgrades-bar`.
4. **Boss rule banner**: `#boss-rule-banner` under `.dealer-title`; shown in `startBossFight()` with `🔥 rule` (+ `⚠ CONTRACT INCOMPLETE` when applicable), hidden when the boss fight ends / on next floor.
5. **Money pulse**: brief scale + green/red flash when money changes.

**Verify:** normal room, boss room (banner shows/clears), contract ticking, perk tooltips.

## Phase 2 — Short is sweet (copy)

1. Action buttons become `icon + one word` (`👊 HIT`, `🛑 STAND`, `💸 DOUBLE`, `✂️ SPLIT`); remove `.subtext`.
2. `ACTION_QUIPS` in `config.js`; quip as `title` tooltip; disabled DOUBLE/SPLIT show a caption via `data-quip` + CSS `::after`.
3. **How to Play** rewritten as three sections — *THE RUN*, *THE HAND*, *THE CATCH* — 2–4 verb-first lines each.
4. Copy audit: perk `desc` over ~40 chars gets tightened (same effect).

**Verify:** buttons are single-line; disabled caption appears.

## Phase 3 — First glance (shop, map, boss intro)

1. **Shop cards**: `rarity-${perk.rarity}` class (border/glow), corner rarity tag, type badge (`∞` passive / `1/floor` uses), much stronger `cannot-afford` state (dim, grayscale, red price, "TOO POOR" stamp). Active-perks strip uses icon badges.
2. **Unique perk icons**: `luckyCharm` 🍀 → 🧿, `lucky7` 🍀 → 7️⃣, `insurance` 💰 → 🧾; audit milestone perks for collisions.
3. **Map**: node border color via `[data-type]` + `--room-*`; one-line legend from `ROOM_ICONS`; contract progress component on map; stronger `.contract-risk` pulse.
4. **Boss intro**: portrait → name → **rule (big, boxed)** → description (small italic) → warning; update stagger selector order.

**Verify:** shop affordable / unaffordable, map with contract done / not done, boss intro.

## Phase 4 — Decoration diet (tracker, history, controls, dealer)

1. **Card tracker**: compact default (remaining count per rank in one block); toggle expands to the full 52 grid. Session-only state (no `localStorage`).
2. **History**: last 5 results as W/L/T pips with `title` hover `21 vs 19`; remove the 20 placeholder rows (internal cap stays 20).
3. **Pause menu**: `#top-left-buttons` → single `☰` opening `#pause-popup` (*Resume / Options / Restart Run / Quit to Menu*); Restart and Quit require inline confirm.
4. **Audio cog**: replace `#music-controls` slider with `⚙️` that opens Options as an overlay and returns to the game.
5. **Dealer presence**: larger centered dealer sprite with name/title under it; player header shrinks to a name tag. Check all boss sprites at the new size.

**Verify:** tracker both modes, history past 5, pause → restart confirm, cog → options → back, all sprites.

## Phase 5 — Consistency (one popup shell)

1. Every `.popup-content` follows:
   `.popup-header (icon + h2) → .popup-sub → .popup-body → .popup-actions (1 primary + optional secondary)`.
2. Migrate all buttons to `.btn--*` roles; delete `post-round-btn`, `restart-btn`, `boss-fight-btn`, `shop-close-btn`, duplicate `event-choice-btn`, `menu-btn-small` styling. `betting-action-btn` / `action-btn` remain as layout-only classes.
3. Exactly one primary button per screen.

**Verify:** every popup type opens with a single obvious primary action. One popup per commit.

## Phase 6 — Wrap-up

- Bump `VERSION` + changelog entry (in voice).
- `?v=` bumps; add `js/game/hud.js` script tag.
- Update `AGENTS.md` load order / module table.
- Retake `screenshots/`, update `README.md` if it describes the old HUD.

---

## Smoke checklist (after every phase)

1. Deal / hit / stand / double / split
2. Chip betting, rebet, 2x, min bet
3. Side bets settle and display
4. Map path selection + colored nodes
5. Shop / event / rest / treasure / gamble rooms
6. Boss fight with rule banner (contract complete & incomplete)
7. Audio controls
8. Broke, victory, pause → restart / quit
9. Window resize (`updateGameScale` still fits 1200×800)

## Risks

- Phase 4.5 (dealer layout) touches the most CSS and every boss sprite — do it last and keep it revertable.
- Phase 5 is a broad HTML change — one popup per commit.
- Options overlay was built for the main menu — review its show/hide flow in `ui.js` before reusing.

## Status

- [x] Phase 0 — Foundations
  - Also removed the legacy `@media` breakpoints: the stage is a fixed 1200×800 scaled by `updateGameScale()`, so they double-shrank text and hid the tracker/scoreboard on windows < 1100px.
  - `.btn--*` roles are defined but not yet applied to existing buttons (Phase 5).
- [x] Phase 1 — HUD hierarchy
  - `js/game/hud.js` now owns `updateDisplay`, `updateRoguelikeDisplay`, perk badges/tooltips, contract meter, rule banner.
  - Money pulse already existed (`GameAnimations.animateMoneyChange`); kept as-is.
  - Boss subtitle under the dealer name no longer repeats the rule (banner shows it).
- [ ] Phase 2 — Copy
- [ ] Phase 3 — First glance
- [ ] Phase 4 — Decoration diet
- [ ] Phase 5 — Consistency
- [ ] Phase 6 — Wrap-up
