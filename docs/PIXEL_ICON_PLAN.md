# Pixel Icon Plan: replace every emoji with CSS art

Follows on from Phase 7 of `UI_OVERHAUL_PLAN.md` (emoji audit) and closes its follow-up **E** (identifier collisions).

**Decisions (2026-11-05):**

- **Unique art per thing.** Nothing shares an icon unless it is literally the same thing (e.g. the HIT button and the Bookie's LOCK IN HIT).
- **In scope:** all pictograph emoji, plus card suits ♠♥♦♣, ⚠, ← and ▸, and the `💀` in CSS `content`.
- **Joke punchlines** in `MESSAGES` (😈 💥 🤔 🎯 👨‍🍳) get small "reaction" icons.
- **Style:** dealer-sprite level. Full colour, 3–6 shapes per icon, flat fills, 1-unit dark outline, same palette as the dealer sprites.
- **Out of scope:** `README.md` / markdown docs, code comments, and `console.log` banners. Console text can't show CSS, so those emoji are deleted.

---

## 1. How the icons are built

Icons use the same technique as `DealerSprites`: an HTML string builder in `sprites.js` plus per-part CSS. Each icon is one inline element that scales with the surrounding `font-size`, so the same icon works in a 12px message, a 16px perk badge and a 48px popup.

### Markup (`js/sprites.js`, new `IconSprites` namespace)

```javascript
const IconSprites = {
    // key → named parts (like hd-visor / hd-head on the House Dealer)
    PARTS: {
        'perk-greed':   ['gem', 'facet', 'shine'],
        'boss-satan':   ['horn-l', 'horn-r', 'head', 'eyes', 'grin'],
        // …
    },

    html(key, extraClass = '') {
        const parts = this.PARTS[key];
        if (!parts) return this.missing(key);
        return `<span class="px-icon px-icon--${key}${extraClass ? ' ' + extraClass : ''}" aria-hidden="true">`
             + parts.map(p => `<i class="${p}"></i>`).join('')
             + `</span>`;
    },

    suit(ch) { return this.html(this.SUIT_KEYS[ch]); },     // '♠' → 'suit-spade'

    // '{i:react-devil}' tokens inside message strings → icon HTML
    expand(str) { return String(str).replace(/\{i:([a-z0-9-]+)\}/g, (_, k) => this.html(k)); },

    missing(key) { /* transition: pass emoji through; final: magenta box + console.warn once */ }
};
```

- `sprites.js` already loads before `game.js`, `hud.js` and `roguelike.js`, so **the script load order doesn't change**.
- Keys are `<table>-<id>` in kebab-case. The table prefix matters because config IDs repeat: `cardShark` is a relic, an elite **and** a dealer perk, `gamble` is a room **and** a rest option, and "X-Ray Vision" is both a perk and a dealer perk.

### CSS (new `icons.css`, linked after `style.css`)

At about 140 icons × about 6 rules, this is 900–1200 lines. A separate stylesheet keeps `style.css` (already 4.7k lines) readable. It still follows the "matching CSS" convention, just in its own file.

```css
.px-icon {
    --u: calc(1.25em / 16);          /* 16×16 design grid, 1.25em box */
    display: inline-block; position: relative;
    width: 1.25em; height: 1.25em; vertical-align: -0.25em;
    flex-shrink: 0;
}
.px-icon > i { position: absolute; display: block; box-sizing: border-box; }
.px-icon > i { border: var(--u) solid var(--ink, #111); }   /* sprite outline */

/* Example: Greed */
.px-icon--perk-greed .gem   { left: calc(var(--u)*2); top: calc(var(--u)*5); width: calc(var(--u)*12); height: calc(var(--u)*8);
                              background: #5ef; clip-path: polygon(0 30%, 25% 0, 75% 0, 100% 30%, 50% 100%); }
```

- Draw everything on the 16-unit grid using `calc(var(--u) * n)`. No raw `px`, so icons scale.
- Shapes come from rectangles, `border-radius` in whole units, `clip-path` polygons and `box-shadow` offsets: the same tools the dealer sprites already use.
- **Suits and the warning sign use `currentColor`.** The existing `.red` / `.black` card classes and tracker colours keep working with no extra logic.
- Shared palette tokens go at the top of `icons.css` (`--ink`, `--gold`, `--blood`, `--felt`, `--bone`, `--hellfire`, `--ghost`) and reuse the existing `style.css` variables wherever they already exist.

### Data (`js/config.js`)

The `icon:` fields change from emoji to keys, e.g. `icon: '💎'` becomes `icon: 'perk-greed'`. `ROOM_ICONS` values become keys. The side-bet result objects in `game.js` change `emoji:` to `icon:` keys. There is one source of truth per icon and no parallel `art:` field.

### Transition safety

While migrating, `IconSprites.html()` passes any non-key string (i.e. a leftover emoji) straight through. That means **each table can be migrated in its own commit and the game keeps working**. The final phase switches `missing()` to render a magenta box and warn, so any leftovers are easy to spot.

---

## 2. Render sites that must change

Several places write icons with `textContent` or into attributes, which can't hold HTML. These are converted once in Phase 0 and wrapped in `IconSprites.html(...)`.

| File | Line(s) | Now | Change |
|---|---|---|---|
| `js/game.js` | 3011 `showMessage` | `innerHTML = <p>${msg}</p>` | Run `IconSprites.expand(msg)` first; strings use `{i:key}` or `${IconSprites.html(...)}` |
| `js/game.js` | 496 bust probability | `textContent` | `innerHTML` + `perk-counter` icon |
| `js/game.js` | 545, `js/animations.js` 146 | `${card.suit}` in card face | `IconSprites.suit(card.suit)` in corners + centre. `card.suit` stays the character because it's game data |
| `js/game.js` | 1538 side-bet toast | `${result.result.emoji}` | `IconSprites.html(result.result.icon)` |
| `js/game.js` | 1924, `roguelike.js` 507 | `.upgrade-icon` | wrap |
| `js/game.js` | 1983 `eventIcon.textContent` | text | `innerHTML` |
| `js/game.js` | 2730 `dealerPerkIcon.textContent` | text | `innerHTML` |
| `js/game.js` | 1828, 2043, 2170, 2191, 2207, 2392 | `${x.icon}` in messages | wrap |
| `js/game/hud.js` | 145 `escapeGoalEl.textContent` | text | `innerHTML` |
| `js/game/hud.js` | 203 perk badge | icon in body **and** `data-perk-name` | Body gets the icon HTML. `data-perk-name` becomes the name only; add `data-perk-icon` (key) |
| `js/game/hud.js` | 231 `.perk-icon` | wrap |
| `js/game/hud.js` | 272 tooltip name | `textContent` | `innerHTML` = icon from `data-perk-icon` + name |
| `js/game/hud.js` | 330, 334 rule banner | string concat | wrap; check that the element uses `innerHTML` |
| `js/roguelike.js` | 104, 139–154, 291 contract text | `${c.icon}` | wrap; 291 is `textContent`, so switch it to `innerHTML` |
| `js/roguelike.js` | 171–174 map legend, 351 map nodes | `ROOM_ICONS[type]` | wrap |
| `js/roguelike.js` | 555 boss rule, 692 rest options, 803 gamble games | `${x.icon}` | wrap |
| `index.html` | 45/63/81/99 tracker suit headers | ♠♥♦♣ | static icon markup (`<span class="px-icon px-icon--suit-spade">…`) |
| `index.html` | 443–446, 636–637 action and Bookie buttons | 👊 🛑 💸 ✂️ | static icon markup |
| `index.html` | 564, 604, 613, 624, 633 popup headers | 🛒 😴 💎 🎰 📒 | static icon markup (same key as the map room / boss) |
| `index.html` | 171, 201, 233 BACK buttons | ← | `ui-arrow-left` |
| `index.html` | 229, 314, 653 warnings | ⚠ | `ui-warning` |
| `index.html` | 664 `#event-icon` default | 🕴️ | empty (JS fills it) |
| `style.css` | 341 `.deck-card::before` | `content:'💀'` | skull drawn **in the pseudo-element** (gradients + `clip-path`); `content:''` |
| `style.css` | 2982 changelog bullet | `content:'▸'` | `clip-path` triangle in `var(--gold)` |
| `style.css` | 4227 map `contract-risk::after` | `content:'⚠'` | `clip-path` triangle + `!` drawn with gradients |
| `js/audio.js` 279, `js/main.js` 87 | console banners | emoji | delete the emoji |

`data-card="A♠"` attributes in `index.html` stay as they are. They're lookup keys, not visuals.

---

## 3. Icon manifest (141 icons)

The notes are art direction. "Was" is today's emoji, and **bold** marks icons that collided before.

### 3.1 Glyphs and UI (9)

| Key | Was | Art |
|---|---|---|
| `suit-spade` / `suit-heart` / `suit-diamond` / `suit-club` | ♠♥♦♣ | Chunky pixel suits, `currentColor`, no outline (they sit on cards) |
| `ui-warning` | ⚠ | Amber triangle, black `!`, `currentColor` outline |
| `ui-arrow-left` | ← | Stepped pixel arrow |
| `ui-bullet` | ▸ | CSS only (changelog `::before`) |
| `ui-deck-skull` | 💀 | CSS only (deck back `::before`): bone skull, red eye sockets |
| `ui-contract` | 📜 (contract messages) | Rolled parchment with a red wax seal |

### 3.2 Actions (4)

| Key | Was | Art |
|---|---|---|
| `action-hit` | 👊 | Fist knocking on the felt (also LOCK IN HIT) |
| `action-stand` | 🛑 | Flat palm, "stop" pose (also LOCK IN STAND) |
| `action-double` | **💸** | Two chip stacks with a gold "2×" |
| `action-split` | ✂️ | Open scissors |

### 3.3 Map rooms (9)

| Key | Was | Art |
|---|---|---|
| `room-normal` | **🃏** | Single red card back |
| `room-elite` | **⚔️** | Crossed swords |
| `room-event` | ❓ | Gold `?` on a dark tile |
| `room-shop` | 🛒 | Striped shop awning over a counter |
| `room-rest` | **😴** | Cot with floating Z |
| `room-treasure` | **💎** | Open chest spilling gold |
| `room-gamble` | **🎰** | Slot cabinet with lever |
| `room-boss` | **👹** | Horned iron door |
| `room-start` | 🚪 | Plain wooden door, ajar |

### 3.4 Bosses (13): mini heads based on each dealer sprite

Reuse each sprite's colours and signature feature so the icon reads as the dealer. Don't embed the full `DealerSprites` markup, which is too heavy and has table-specific layout.

| Key | Was | Signature feature (from `sprites.js` / `style.css`) |
|---|---|---|
| `boss-pitboss` | 👔 | Tan head, black glasses bar, flat hair |
| `boss-ladyluck` | 🎭 | Blindfold + gold coin |
| `boss-loanshark` | **🦈** | Grey shark head, row of teeth, fin |
| `boss-countess` | 🧛 | Pale face, fangs, blood drop |
| `boss-twins` | 👯 | Two small heads side by side |
| `boss-grandmaster` | 🎩 | Crown + monocle |
| `boss-croupier` | 🎴 | Hat + curled mustache |
| `boss-hangman` | 🪢 | Frowning head under a noose loop |
| `boss-jester` | **🃏** | Two-point belled hat, grin |
| `boss-bookie` | 📒 | Head with cigarette + ledger corner |
| `boss-widow` | 🕷️ | Black veil + spider |
| `boss-auditor` | 📋 | Glasses + clipboard |
| `boss-satan` | **👹** | Red head, horns, fangs, goatee |

### 3.5 Elites (8)

| Key | Was | Art |
|---|---|---|
| `elite-card-shark` | **🦈** | Shark fin that's a playing card cutting through felt |
| `elite-timekeeper` | **⏰** | Gold pocket watch on a chain |
| `elite-collector` | 🏺 | Urn with a relic glint |
| `elite-mirror` | **🪞** | Tall standing mirror, dealer silhouette inside |
| `elite-high-roller` | **🎰** | Towering chip stack, gold top chip |
| `elite-trickster` | **🃏** | Card with a swirl and a ±1 |
| `elite-banker` | 🏦 | Round vault door |
| `elite-phantom` | 👻 | Sheet ghost holding a face-down card |

### 3.6 Dealer perks (7)

| Key | Was | Art |
|---|---|---|
| `dperk-stand-on-18` | **🛡️** | Iron anvil stamped "18" |
| `dperk-hit-soft-17` | **⚔️** | Clawed fist punching through a card |
| `dperk-peek-hole` | **👁️** | Red eye peeking under a card corner |
| `dperk-fast-hands` | 🖐️ | Hand with motion streaks |
| `dperk-tax-collector` | **💸** | Collection tin with a coin slot |
| `dperk-house-edge` | 🏠 | Little house tipping off a cliff edge |
| `dperk-card-shark` | **🦈** | Deck with a shark bite out of it |

### 3.7 Contracts (7)

| Key | Was | Art |
|---|---|---|
| `contract-win-streak` | **🔥** | Chip on fire |
| `contract-bankroll` | 💰 | Money bag with a house-roof stamp |
| `contract-elite-clear` | **⚔️** | WANTED poster with a red X |
| `contract-blackjack` | **🃏** | Ace + King fanned |
| `contract-split-win` | **✂️** | Card torn in two |
| `contract-hands-won` | **🎯** | Chalk tally marks |
| `contract-defeat-satan` | **👹** | Parchment with a horned red wax seal |

### 3.8 Perks (15)

| Key | Was | Art |
|---|---|---|
| `perk-peek` | **👁️** | Blue eye over a see-through card outline |
| `perk-lucky7` | 7️⃣ | Gold slot "7" |
| `perk-insurance` | 🧾 | Receipt with a red FRAUD stamp |
| `perk-counter` | 🧠 | Pink brain with +/− |
| `perk-lucky-charm` | 🧿 | Blue nazar bead |
| `perk-second-chance` | **🔄** | Rewind arrow around a card |
| `perk-double-or-nothing` | **🎲** | Pair of gold dice |
| `perk-shield` | **🛡️** | Shield with a soul flame |
| `perk-thief` | 🤏 | Fingers pinching a coin |
| `perk-meditation` | **🧘** | Lotus holding a coin |
| `perk-quick-draw` | ⚡ | Lightning bolt across a card |
| `perk-greed` | **💎** | Cut gem with `$` shine |
| `perk-vampiric` | **🧛** | Fang bite dripping a gold drop |
| `perk-last-stand` | **💪** | Bandaged flexed arm |
| `perk-double-down` | 🕵️ | Fedora + dark glasses |

### 3.9 Side-bet perks (8)

| Key | Was | Art |
|---|---|---|
| `sbperk-pair-hunter` | **👯** | Magnifier over two matching cards |
| `sbperk-poker-face` | **🎭** | Blank white mask, flat mouth |
| `sbperk-side-show` | 🎪 | Striped circus tent |
| `sbperk-side-master` | 🏆 | Gold trophy |
| `sbperk-lucky-start` | **🌟** | Shooting star |
| `sbperk-side-insurance` | 🛟 | Life ring |
| `sbperk-double-down-21` | ♠️ | Spade with "21" |
| `sbperk-perfect-streak` | **✨** | Sparkle trail over three chips |

### 3.10 Relics (12)

| Key | Was | Art |
|---|---|---|
| `relic-lucky-chip` | **🪙** | Gold chip with a clover |
| `relic-devils-dice` | **🎲** | Red die with horns |
| `relic-snake-eyes` | 🐍 | Snake coiled round two 1-pip dice |
| `relic-ace-in-hole` | **🃏** | Ace sliding out of a sleeve cuff |
| `relic-blood-pact` | 🩸 | Quill dripping blood |
| `relic-golden-horseshoe` | 🧲 | Golden horseshoe (replaces the magnet) |
| `relic-rabbit-foot` | 🐰 | Rabbit's foot on a keychain |
| `relic-cursed-mirror` | **🪞** | Cracked purple hand mirror |
| `relic-heavy-wallet` | **👛** | Bulging wallet with a weight tag |
| `relic-gamblers-bane` | ☠️ | Skull biting a chip |
| `relic-phoenix-feather` | **🔥** | Flaming feather |
| `relic-card-shark` | **🦈** | Shark-tooth necklace |

### 3.11 Curses (8)

| Key | Was | Art |
|---|---|---|
| `curse-bad-luck` | 🖤 | Black cat, yellow eyes |
| `curse-heavy-debt` | 📜 | Ball and chain stamped `$` |
| `curse-shaky` | 😰 | Trembling hand with a sweat drop |
| `curse-marked` | **🎯** | Card with a red crosshair |
| `curse-taxed` | **💸** | Coin with a bite taken out |
| `curse-paranoid` | 👀 | Shifty eyes in the dark |
| `curse-impatient` | **⏰** | Ringing alarm clock |
| `curse-poor-eyesight` | 👓 | Cracked glasses |

### 3.12 Events (10)

| Key | Was | Art |
|---|---|---|
| `event-mysterious-stranger` | 🕴️ | Hooded figure, glowing eyes |
| `event-devil-deal` | 😈 | Devil claw shaking a hand |
| `event-lost-wallet` | **👛** | Dropped wallet, coins spilling |
| `event-card-gambler` | **🃏** | Hand fanning three cards |
| `event-cursed-chest` | 📦 | Chained chest with eyes in the gap (mimic) |
| `event-fortune-teller` | 🔮 | Crystal ball on a stand |
| `event-black-market` | 🕳️ | Open trench coat lined with goods |
| `event-blessed-shrine` | ⛩️ | Small red shrine gate |
| `event-drunk-gambler` | 🍺 | Foaming mug |
| `event-breaking-news` | 📺 | Old TV with antenna |

### 3.13 Shop items (10)

| Key | Was | Art |
|---|---|---|
| `shop-heal-small` | 🩹 | Bandage |
| `shop-heal-medium` | 💊 | Two-tone pill |
| `shop-heal-large` | 🏥 | Scalpel over a red cross |
| `shop-remove-curse` | **✨** | Holy water flask |
| `shop-random-perk` | **❓** | Box with a `?` |
| `shop-random-relic` | 🎁 | Ribboned gift box |
| `shop-extra-life` | **🔥** | Vial holding a feather tuft |
| `shop-deck-peek` | **👁️** | Deck with a see-through top card |
| `shop-reduce-bet` | 🎫 | Gold VIP ticket |
| `shop-refresh` | **🔄** | Crate with a circular arrow |

### 3.14 Rest options (4) and gamble games (4)

| Key | Was | Art |
|---|---|---|
| `rest-rest` | **😴** | Pillow + Z |
| `rest-meditate` | **🧘** | Lit candle |
| `rest-train` | **💪** | Dumbbell |
| `rest-gamble` | **🎰** | Chip with a `?` |
| `game-coin-flip` | **🪙** | Coin mid-flip with motion lines |
| `game-dice-roll` | **🎲** | White die |
| `game-wheel-spin` | 🎡 | Fortune wheel |
| `game-slots` | **🎰** | Reel strip showing 7-7-7 |

### 3.15 Side-bet results (8), `game.js` ~1432–1467

| Key | Was | Art |
|---|---|---|
| `hand-perfect-pair` | **👯** | Two identical cards |
| `hand-colored-pair` | 🎨 | Two same-colour cards, different suits |
| `hand-mixed-pair` | 👫 | Red + black pair |
| `hand-suited-trips` | **🔥** | Three identical cards with a flame |
| `hand-straight-flush` | **🌟** | Ascending same-suit run + star |
| `hand-three-of-a-kind` | **🎰** | Three same-rank cards |
| `hand-straight` | 📈 | Staircase of cards |
| `hand-flush` | **💎** | Fan of same-suit cards |

### 3.16 Reactions (5), `MESSAGES` punchlines

| Key | Was | Art |
|---|---|---|
| `react-devil` | 😈 | Grinning devil face (smaller and simpler than `boss-satan`) |
| `react-boom` | 💥 | Comic burst |
| `react-think` | 🤔 | Chin-scratch face |
| `react-bullseye` | 🎯 | Dart in a bullseye |
| `react-chef` | 👨‍🍳 | Chef hat + kiss mark |

### 3.17 Message-only icons, mapped to a source (no new art)

Every leading emoji in a `showMessage` call becomes the icon of the **thing that caused it**:

| Message (file:line) | Icon |
|---|---|
| Perk, relic, curse, boss or elite messages (Zen Mind, Soul Shield, Quick Draw, Double Agent, Vampiric, Pickpocket, Lucky Start, Side Insurance, Heavy Debt, Countess, Twins, Lady Luck, Hangman, Widow, Auditor, Croupier, Jester, Bookie) | That item's or boss's key |
| `✂️ Split …` (game.js 2463, 2585–2597) | `action-split` |
| `🎴 High/Low card` (2219/2222), `♠️/♦️ Suit` (2231/2234) | `event-card-gambler` |
| `🍺` (2243/2246) | `event-drunk-gambler` |
| `📦` (2269–2278) | `event-cursed-chest` |
| `🔮` (2286/2288) | `event-fortune-teller` |
| `🗡️ Gained a relic… at what cost` (2111) | Icon of the event that called it (check the caller during Phase 6) |
| `🃏 Deck has / Next N cards` (2294/2300) | `shop-deck-peek` |
| `📜 Contract …` (roguelike 252, 277, 611) | current `contract.icon`, else `ui-contract` |
| `⚔️ Elite …` / `🃏 Win a hand…` (roguelike 441–454, 583; hud 334) | `room-elite` / `room-normal`, boss/elite key |
| `😴 Rest` (682) / `Restored` (714) / rest gamble (723/726) | `room-rest` / `rest-rest` / `rest-gamble` |
| `💎 Treasure …` (746–752) | `room-treasure` |
| `🎰 Won/Lost` gamble room (788–813) | the game's key |
| `🔥` boss fallbacks (roguelike 555, hud 330) | `room-boss` |

---

## 4. Phases (one commit each, game playable after every one)

**Phase 0: Infrastructure.** No visual change yet.
- `IconSprites` in `sprites.js` (with emoji passthrough), `icons.css` base + palette tokens, `<link>` in `index.html`.
- `showMessage` runs `IconSprites.expand`.
- Convert every render site in §2 to `IconSprites.html(...)` / `innerHTML`, and split `data-perk-name` / `data-perk-icon`.
- **`icon-gallery.html`** (dev-only, not linked from the game): loads `config.js`, `sprites.js`, `style.css`, `icons.css`. Renders every key at 16 / 24 / 48px on felt and dark backgrounds, and lists config `icon:` values with no registry entry. This is the main way to test the art.

**Phase 1: Glyphs and UI** (§3.1): suits on cards, tracker and side-bet copy; warning; arrows; CSS pseudo-element art. Sets the outline weight and palette everything else follows.

**Phase 2: Most visible:** actions (§3.2), rooms + map legend + popup headers (§3.3).

**Phase 3: Characters:** bosses (§3.4), elites (§3.5), dealer perks (§3.6).

**Phase 4: Player build:** perks (§3.8), side-bet perks (§3.9).

**Phase 5: Loot:** relics (§3.10), curses (§3.11).

**Phase 6: Rooms content:** contracts (§3.7), events (§3.12), shop items (§3.13), rest + gamble (§3.14), message mapping (§3.17).

**Phase 7: Results and jokes:** side-bet results (§3.15), reactions (§3.16) as `{i:react-…}` tokens in `MESSAGES`.

**Phase 8: Lockdown.**
- Switch `IconSprites.missing()` from passthrough to a magenta box + `console.warn`.
- Strip the console-banner emoji.
- Run the emoji scan below. Only comments may match (`→` / `←` in code comments).
- `?v=` bumps on every edited file; `VERSION` + changelog entry; update `AGENTS.md` (file tree, load order note for `icons.css`, "icons: add key to `IconSprites.PARTS` + CSS in `icons.css`"); retake `screenshots/`.

Emoji scan (run from repo root):

```bash
python -I -X utf8 -c "import re,glob;p=re.compile('[\U0001F000-\U0001FFFF☀-➿⬀-⯿⌀-⏿←-⇿■-◿️]');[print(f,i,l.strip()[:120]) for f in ['index.html','style.css','icons.css']+glob.glob('js/**/*.js',recursive=True) for i,l in enumerate(open(f,encoding='utf-8'),1) if p.search(l)]"
```

## 5. Verification per phase

1. `icon-gallery.html`: each new icon is readable at 16px, has no clipping at 48px, and isn't confused with its old collision partners.
2. The in-game spots for that phase (§2 table).
3. The usual smoke checklist in `UI_OVERHAUL_PLAN.md`, plus:
   - Perk tooltip shows the icon + name and is positioned correctly
   - Card faces: suits centred, red/black correct, deal/flip animations (`animations.js buildCardFace`) unchanged
   - Map nodes: icon centred in the node; `contract-risk` badge still visible
   - Messages with icons don't change the message bar's height
   - `updateGameScale()` at small window sizes: icons stay crisp (no sub-pixel blur on outlines)

## 6. Risks and notes

- **Size:** the art is the bulk of the work (141 icons). Phases 3–7 can be split further, by table, without any risk.
- **Small sizes:** at 16px, 1 unit = 1.25px. Keep details at least 2 units and check them in the gallery first.
- **`innerHTML` switch:** the converted sites only take config data and numbers. No user text goes in, so there's no new injection surface. Keep it that way.
- **`card.suit` stays a character.** Flush/straight detection, `isRed` checks and `data-card` lookups depend on it. Only rendering changes.
- **Poor Eyesight / curses (fixed in 2.1.1):** none of the curses had any effect in the live game, because `hasCurse` lived only in the unshipped `game/perks.js`. `js/game/curses.js` now implements all eight. Card faces wrap suits in `.card-suit` spans; when suit icons replace those glyphs, keep the wrapper so `.curse-hidden-suits` keeps working.
- No balance, payout or economy numbers change.

---

## Status (2026-11-05)

All phases are done: 0 through 8, one commit each.

- **142 icon keys** in `IconSprites`: the 141 in §3, plus `ui-menu` and `ui-cog` for the ☰ / ⚙ buttons, which used HTML entities and were missed by the first scan. `ui-bullet` never became a key; the changelog bullet is drawn directly in CSS.
- **Part classes are `p-<part>`.** Bare names like `.hand` collided with page CSS (the player's hand), so every part is prefixed.
- **`IconSprites.STRICT` is on.** An unknown key renders a magenta box and logs a `console.warn`.
- **Deck backs carry a real `ui-deck-skull` icon**, not pseudo-element art, because `updateDeckDisplay` builds them in JS anyway.
- **The map `contract-risk` badge is drawn in CSS**: an amber triangle from two gradients with a `!`.
- **Unshipped `js/game/*.js` modules** (`sidebets.js`, `perks.js`, `betting.js`) were updated too, so wiring them later doesn't bring the emoji back.
- **Remaining glyphs (intended):** suit characters used as card data (`card.suit`, `data-card`, `SUITS`, red-suit checks), arrows in code comments, and `∞` in the shop's `∞ PASSIVE` tag (a maths symbol, not an emoji).
- **Not done:** retaking `screenshots/`.
- **Found:** relics and curses have no HUD badge row (only perks show), so active curses are invisible after the pick-up message.
