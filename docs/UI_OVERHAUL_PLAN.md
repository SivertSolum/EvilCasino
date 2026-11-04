# Evil Casino — UI Overhaul Implementation Plan

Reference: [5 UI mistakes I made and the principles that fixed them](https://www.covyne.com/news/5-ui-mistakes-i-made-and-the-principles-that-fixed-them)
(hierarchy · short is sweet · first glance · recognition over decoration · consistency).

Eight phases (0–7), each shippable and testable on its own. **No balance numbers change in any phase.**

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

## Phase 7 — Emoji audit (analysis first, then trim)

Goal: emoji only where it **carries meaning the text doesn't** (recognition, not decoration).

1. **Inventory** every emoji in `index.html`, `config.js` copy and JS-built strings (`showMessage`, popup titles, button labels). Tag each one:
   - **Keep: identifier.** The icon *is* the thing's identity and is used for recognition elsewhere (perk icons, room icons on map + legend, boss icons, contract icons, chip/suit glyphs).
   - **Keep: state signal.** Encodes status at a glance (⚠ contract risk, ✓ done, rule-banner icon).
   - **Cut: label decoration.** Sits next to a word that already says it (`🎲 START GAME`, `⚙️ OPTIONS`, `❓ HOW TO PLAY`, `📜 Changelog`, `← BACK` arrows are fine, `✖ LEAVE SHOP`, `⚔️ FIGHT ⚔️`, `🎰 Play Again?`, section headings like `🎭 Perks:` / `🛒 PERK SHOP`).
   - **Cut: message noise.** Leading emoji in `showMessage` strings that don't map to a recognized identifier.
2. **Rules of thumb:** at most one emoji per control; never on both sides of a label; menu/system buttons (start, options, back, close, restart) get none; if an emoji appears in a tooltip/legend as the identifier for X, keep it consistent everywhere X appears.
3. **Output:** a table (location → emoji → keep/cut → reason) appended here, reviewed before any removal, then a single trim pass + `?v=` bumps.

**Verify:** menus, popups and messages still read clearly; identifiers (perks, rooms, bosses) unchanged.

### Phase 7 audit (2026-11-04) — approved; B, C, D applied

Scan: 289 emoji-bearing lines (66 in `index.html` + UI modules, 76 in `game.js`, 147 in `config.js` of which 104 are `icon:` fields). Card suits ♠♥♦♣ and `☰`/`⚙` glyphs excluded.

#### A. KEEP — identifiers (recognition)

| Where | What | Why |
|---|---|---|
| `config.js` `icon:` fields (104) | Perks, relics, curses, dealer perks, bosses, elites, contracts, events, shop items, gamble games | The icon *is* the identity; shown in badges, tooltips, map, banner, shop |
| `ROOM_ICONS` | 🃏 ⚔️ ❓ 🛒 😴 💎 🎰 👹 🚪 | Map nodes + legend |
| Room popup titles | `🛒 PERK SHOP`, `😴 REST SITE`, `💎 TREASURE`, `🎰 GAMBLE ROOM` | Same icon as the map node you clicked — continuity |
| `📒 THE BOOKIE` popup title | 📒 | Matches the Bookie's boss icon |
| Action buttons + Bookie choices | 👊 HIT, 🛑 STAND, 💸 DOUBLE, ✂️ SPLIT, `👊/🛑 LOCK IN …` | Gameplay controls scanned under time pressure; same glyph reused in Bookie popup |
| `#event-icon` | set from `EVENTS[].icon` | Event identity |
| Rule banner / boss intro rule | `${boss.icon}` / `⚔️` (elite) | Identifies whose rule it is |
| Bust probability | `🧠 Bust: x%` | Card Counter's icon — tells you *why* you see it |
| Side-bet result `emoji:` (`game.js` ~1432–1467) | 👯 🎨 👫 🔥 🌟 🎰 📈 💎 | Hand-type identifiers in the result toast (see C for collisions) |
| Messages whose emoji == the source's icon | e.g. `🛡️ Soul Shield…`, `🧘 Zen Mind…`, `🕷️ Black Widow…`, `👯 Twins…`, `🎭 Lady Luck…`, `🪢 Hangman…`, `📋 Auditor…`, `🎴 Croupier…`, `🃏 Jester…`, `⚡ Quick Draw…`, `🕵️ Double Agent…`, `🧛 Vampiric…`, `🤏 Pickpocket…`, `🌟 Lucky Start…`, `🔮 / 📦 / 🍺 / 🗡️` event outcomes, `😴 / 🎰 / 💎` room outcomes, `✂️ Split…`, `📜 Contract…` | Message → source recognition |

#### A2. KEEP — state signals

| Where | What |
|---|---|
| Rule banner, boss intro, map boss badge | ⚠ contract incomplete |
| How to Play | `⚠️ The dealer may or may not cheat` |

#### B. FIX — wrong identifier (emoji ≠ source icon)

| Location | Now | Should be |
|---|---|---|
| `game.js` ~974 Heavy Debt message | 💸 | 📜 (curse icon) |
| `game.js` ~1016 Side Insurance message | 🛡️ | 🛟 (perk icon) |
| `game.js` ~1165 Countess drain message | 💸 | 🧛 (boss icon) |
| `game.js` ~1828 boss extra-loss message | 🦈 hardcoded | `${this.currentBoss.icon}` (any `multiplierLose` boss) |

#### C. CUT — label decoration (word already says it)

| Location | Now → After |
|---|---|
| Shuffle overlay | `🔀 SHUFFLING 🔀` → `SHUFFLING` |
| Side panel headings | `🃏 CARDS`, `📊 SCOREBOARD` → `CARDS`, `SCOREBOARD` |
| Main menu buttons | `🎲 START GAME`, `⚙️ OPTIONS`, `❓ HOW TO PLAY`, `📜 Changelog` → text only |
| Menu screen titles | `📜 CHANGELOG`, `⚙️ OPTIONS`, `❓ HOW TO PLAY` → text only |
| Options row labels | `🔊 Music`, `🎚️ Volume`, `🔉 SFX`, `🎵 Custom Music` → text only |
| Upgrade popup | `🎁 CHOOSE YOUR PERK 🎁` → `CHOOSE YOUR PERK` |
| Victory popup | `🏆 YOU DEFEATED SATAN! 🏆` → `YOU DEFEATED SATAN!`; `🎰 Play Again?` → `Play Again?` |
| Boss fight button | `⚔️ FIGHT ⚔️` → `FIGHT` |
| Map side-table button | `🃏 SIDE TABLE` → `SIDE TABLE` |
| Event choice texts (`config.js` 443–543, 30 choices) | `🚶 Walk away`, `🙅 Pass`, `❌ Decline`, `💵 Pay $75…`… → text only (cost line already carries risk) |

#### D. CUT — message noise (emoji not tied to an identifier)

| Location | Examples |
|---|---|
| Trailing emoji on status lines (`game.js`) | `Dealing... 🃏`, `Dealer stands on 17. 🛑`, `Dealer must hit... 🎴`, `Dealer BUSTS at 23! 💥`, `Hand 1 BUSTS! 💥`, `Your move, genius. 🤔`, `Place your bet, if you dare... 💰`, `New run! … 🎰`, `Going all in? … 🎲`, `…going all in with $x! 💸`, `Bold move, cotton. 💀`, `Push! … 🤷` |
| Generic leading emoji | `🎉 Purchased X!` → `Purchased ${perk.icon} X!`; `🎁 Gained perk: ${icon} X` / `🏆 Found relic: ${icon} X` / `💀 Cursed: ${icon} X` → drop the generic prefix (item icon stays); `💰 Gained $x`; `✨ Curse removed` / `✨ All curses purged`; `🙏 Blessing…` / `🙏 Blessed…`; `👻 Mimic…` (collides with Phantom elite); `💨 Empty chest`; `🧘 You meditated` (collides with Zen Mind perk); `🎉 Tournament…` |
| Dead code | `audio.js` / `ui.js` 🔇/🔊 writes to `#music-toggle` (removed in Phase 4) → delete branches |
| Leave alone | `MESSAGES` joke tables (`😈`, `👨‍🍳` are punchlines); `console.log` banners (dev only) |

#### E. Follow-up (not part of the trim): identifier collisions

The audit surfaced icons shared by *different* things, which undercuts recognition:

- 🦈 Loan Shark (boss), Card Shark (elite), Card Shark (dealer perk), Card Shark (relic)
- 🃏 Jester (boss), Trickster (elite), Card Gambler (event), Ace in the Hole (relic), normal room
- 🎰 High Roller (elite), gamble room, Slot Machine, rest "Gamble", Three of a Kind
- 💸 Tax Collector (dealer perk), Casino Tax (curse), DOUBLE button
- 🪙 Coin Flip / Lucky Chip · 🪞 Mirror (elite) / Cursed Mirror · ⏰ Timekeeper / Impatient · 👛 Lost Wallet / Heavy Wallet · 🔥 Phoenix Feather / Hot Streak / Suited Trips · 🛡️ Iron Stance / Soul Shield · ⚔️ Aggressive Play / elite room · 💎 Greed / treasure room / Flush

Recommendation: a separate pass to give each a unique icon (content change in `config.js` only).

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
- [x] Phase 2 — Copy
  - Subtexts were already hidden by CSS; removed the dead spans. `ACTION_QUIPS` (config.js) drive a hover tag and a disabled caption (fixed padding, so the bar never resizes).
  - How to Play → THE RUN / THE HAND / THE CATCH (added SPLIT, which was missing).
  - Tightened: Perfect Streak, X-Ray Vision, Card Shark descs; Bookie and Black Widow boss rules (same effects).
- [x] Phase 3 — First glance
  - Fixed latent bug: JS added `cannot-afford` but CSS styled `.unaffordable`, so unaffordable perks never looked different.
  - Shop rendering (`renderPreRoundShopItems`, `renderActivePerksInShop`) moved to `hud.js`; shared `buildPerkBadgeHtml`.
  - Icons: Lucky 7s 🍀→7️⃣, Lucky Charm 🍀→🧿, Insurance Fraud 💰→🧾. `MESSAGES.tooPoor` stamps.
  - Map: per-room colors on every node, legend, contract goal + shared meter, ⚠ badge on boss while contract is open.
  - Boss intro: rule box first, flavor second, warning as its own line.
- [x] Phase 4 — Decoration diet
  - Tracker: compact per-rank pips + 10-value / total summary (default), FULL GRID toggle. Fixed latent bug: red-suit CSS used `nth-child` offset by the `<h3>`, coloring ♠/♥ red and ♦ black.
  - History: last 5 pips + "LAST: x vs y"; `renderHistoryList` moved to `hud.js`.
  - Pause menu (`☰ MENU`) with confirm for restart/quit; logic in `ui.js`, copy in `MESSAGES.pauseConfirm`.
  - Audio: in-game toggle + slider replaced by ⚙ that opens the shared Options overlay.
  - Dealer sprite 2× on the table (left-aligned, not centered — the rule banner owns the right side); player header shrunk.
  - Not done: reclaiming the left column width for the table (tracker still occupies it, just quieter).
- [x] Phase 5 — Consistency
  - All popups on `.popup-header / .popup-sub / .popup-body / .popup-actions`, one `.btn--primary` each.
  - Deleted legacy button CSS (`post-round-btn`, `restart-btn`, `boss-fight-btn`, `shop-close-btn`, `menu-btn-small`, `reset-btn`, `shop-btn*`, `shop-info`) and dead audio-slider CSS.
  - Merged duplicate rules: `.event-content`, `.event-header`, `.event-icon`, `.event-content h2`, `.event-choices`, `.boss-portrait`, `.table.elite-mode`, `.action-btn` (kept values that actually rendered).
  - Main menu / options / how-to / changelog keep `.menu-btn` (separate screen family). Remaining duplicate selectors: `.split-hand`, `.rebet-*`, `.side-bets-total` (legacy, not touched).
- [x] Phase 6 — Wrap-up
  - `VERSION` 2.1.0 + changelog entry; `?v=` bumps; AGENTS.md + BUILD_AND_TEST.md (HUD checklist).
  - **Open:** retake `screenshots/` (needs a browser session).
- [ ] Phase 7 — Emoji audit
  - [x] Inventory + keep/cut table (see "Phase 7 audit" above)
  - [x] Review → trim pass (B fixes, C/D cuts) + `?v=` bumps — all approved and applied (29 event choices, not 30; also cut `🏆 Tournament won`, same category as D)
  - [ ] Optional follow-up: unique icons for collisions (E)
