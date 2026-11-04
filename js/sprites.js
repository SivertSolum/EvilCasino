// EVIL CASINO - CSS sprite HTML builders (Satan pattern)

const DealerSprites = {
    houseDealer() {
        return `
        <div class="dealer-sprite house-dealer-container" data-sprite="house">
            <div class="house-dealer">
                <div class="hd-visor"></div>
                <div class="hd-head">
                    <div class="hd-eyes">
                        <div class="hd-eye left"><div class="hd-pupil"></div></div>
                        <div class="hd-eye right"><div class="hd-pupil"></div></div>
                    </div>
                    <div class="hd-nose"></div>
                    <div class="hd-mouth"></div>
                </div>
                <div class="hd-bowtie"></div>
                <div class="hd-collar"></div>
            </div>
        </div>`;
    },

    pitboss() {
        return `
        <div class="dealer-sprite boss-sprite pitboss-container" data-sprite="pitboss">
            <div class="pitboss">
                <div class="pb-hair"></div>
                <div class="pb-head">
                    <div class="pb-glasses"></div>
                    <div class="pb-eyes">
                        <div class="pb-eye"></div><div class="pb-eye"></div>
                    </div>
                    <div class="pb-mouth"></div>
                </div>
                <div class="pb-clipboard"></div>
            </div>
        </div>`;
    },

    ladyluck() {
        return `
        <div class="dealer-sprite boss-sprite ladyluck-container" data-sprite="ladyluck">
            <div class="ladyluck">
                <div class="ll-hair"></div>
                <div class="ll-head">
                    <div class="ll-blindfold"></div>
                    <div class="ll-coin"></div>
                    <div class="ll-smile"></div>
                </div>
            </div>
        </div>`;
    },

    loanshark() {
        return `
        <div class="dealer-sprite boss-sprite loanshark-container" data-sprite="loanshark">
            <div class="loanshark">
                <div class="ls-fin"></div>
                <div class="ls-head">
                    <div class="ls-eyes"><div class="ls-eye"></div><div class="ls-eye"></div></div>
                    <div class="ls-teeth"></div>
                </div>
            </div>
        </div>`;
    },

    countess() {
        return `
        <div class="dealer-sprite boss-sprite countess-container" data-sprite="countess">
            <div class="countess">
                <div class="ct-hair"></div>
                <div class="ct-head">
                    <div class="ct-eyes"><div class="ct-eye"></div><div class="ct-eye"></div></div>
                    <div class="ct-fangs"><div></div><div></div></div>
                </div>
                <div class="ct-drop"></div>
            </div>
        </div>`;
    },

    twins() {
        return `
        <div class="dealer-sprite boss-sprite twins-container" data-sprite="twins">
            <div class="twins">
                <div class="tw-head left">
                    <div class="tw-eye"></div>
                    <div class="tw-mouth"></div>
                </div>
                <div class="tw-head right">
                    <div class="tw-eye"></div>
                    <div class="tw-mouth"></div>
                </div>
                <div class="tw-collar"></div>
            </div>
        </div>`;
    },

    grandmaster() {
        return `
        <div class="dealer-sprite boss-sprite grandmaster-container" data-sprite="grandmaster">
            <div class="grandmaster">
                <div class="gm-crown"></div>
                <div class="gm-head">
                    <div class="gm-monocle"></div>
                    <div class="gm-eyes"><div class="gm-eye"></div><div class="gm-eye"></div></div>
                    <div class="gm-mouth"></div>
                </div>
            </div>
        </div>`;
    },

    croupier() {
        return `
        <div class="dealer-sprite boss-sprite croupier-container" data-sprite="croupier">
            <div class="croupier">
                <div class="cr-hat"></div>
                <div class="cr-head">
                    <div class="cr-eyes"><div class="cr-eye"></div><div class="cr-eye"></div></div>
                    <div class="cr-mustache"></div>
                </div>
                <div class="cr-chip"></div>
            </div>
        </div>`;
    },

    hangman() {
        return `
        <div class="dealer-sprite boss-sprite hangman-container" data-sprite="hangman">
            <div class="hangman">
                <div class="hg-noose"></div>
                <div class="hg-head">
                    <div class="hg-eyes"><div class="hg-eye"></div><div class="hg-eye"></div></div>
                    <div class="hg-frown"></div>
                </div>
            </div>
        </div>`;
    },

    jester() {
        return `
        <div class="dealer-sprite boss-sprite jester-container" data-sprite="jester">
            <div class="jester">
                <div class="js-hat"><div class="js-bell l"></div><div class="js-bell r"></div></div>
                <div class="js-head">
                    <div class="js-eyes"><div class="js-eye"></div><div class="js-eye"></div></div>
                    <div class="js-grin"></div>
                </div>
            </div>
        </div>`;
    },

    bookie() {
        return `
        <div class="dealer-sprite boss-sprite bookie-container" data-sprite="bookie">
            <div class="bookie">
                <div class="bk-head">
                    <div class="bk-eyes"><div class="bk-eye"></div><div class="bk-eye"></div></div>
                    <div class="bk-cig"></div>
                    <div class="bk-mouth"></div>
                </div>
                <div class="bk-ledger"></div>
            </div>
        </div>`;
    },

    widow() {
        return `
        <div class="dealer-sprite boss-sprite widow-container" data-sprite="widow">
            <div class="widow">
                <div class="wd-veil"></div>
                <div class="wd-head">
                    <div class="wd-eyes"><div class="wd-eye"></div><div class="wd-eye"></div></div>
                    <div class="wd-lips"></div>
                </div>
                <div class="wd-spider"></div>
            </div>
        </div>`;
    },

    auditor() {
        return `
        <div class="dealer-sprite boss-sprite auditor-container" data-sprite="auditor">
            <div class="auditor">
                <div class="au-glasses"></div>
                <div class="au-head">
                    <div class="au-eyes"><div class="au-eye"></div><div class="au-eye"></div></div>
                    <div class="au-mouth"></div>
                </div>
                <div class="au-clipboard"></div>
            </div>
        </div>`;
    },

    satan() {
        return `
        <div class="dealer-sprite boss-sprite satan-mount" data-sprite="satan">
            <div class="satan-container">
                <div class="satan">
                    <div class="horns">
                        <div class="horn left"></div>
                        <div class="horn right"></div>
                    </div>
                    <div class="satan-head">
                        <div class="satan-eyes">
                            <div class="eye left"><div class="pupil"></div></div>
                            <div class="eye right"><div class="pupil"></div></div>
                        </div>
                        <div class="satan-nose"></div>
                        <div class="satan-mouth">
                            <div class="fang left"></div>
                            <div class="fang right"></div>
                        </div>
                    </div>
                    <div class="goatee"></div>
                </div>
                <div class="flames" style="display:flex">
                    <div class="flame f1"></div>
                    <div class="flame f2"></div>
                    <div class="flame f3"></div>
                </div>
            </div>
        </div>`;
    },

    get(id) {
        if (id === 'house' || id === 'elite') return this.houseDealer();
        if (typeof this[id] === 'function') return this[id]();
        return this.houseDealer();
    },

    titleFor(id, boss) {
        // Rule lives in the HUD rule banner; subtitle stays flavor only
        if (boss) return `${boss.name}<br><span class="satan-subtitle">${boss.id === 'satan' ? 'THE HOUSE ITSELF' : 'ANOMALY DEALER'}</span>`;
        if (id === 'elite') return `ELITE DEALER<br><span class="satan-subtitle">HOUSE ENFORCER</span>`;
        return `HOUSE DEALER<br><span class="satan-subtitle">DEFINITELY FAIR</span>`;
    }
};

// EVIL CASINO - CSS pixel icons (same idea as DealerSprites, inline-sized)
// Each key maps to named parts; icons.css draws them on a 16×16 unit grid.
// Keys are `<table>-<id>` in kebab-case, e.g. `perk-greed`, `boss-satan`.
const IconSprites = {
    PARTS: {},

    SUIT_KEYS: { '♠': 'suit-spade', '♥': 'suit-heart', '♦': 'suit-diamond', '♣': 'suit-club' },

    // false while emoji are still being migrated: unknown keys pass through as text
    STRICT: false,
    _warned: {},

    // Parts are listed as space-separated names
    define(map) {
        for (const key of Object.keys(map)) this.PARTS[key] = map[key].split(' ');
    },

    has(key) {
        return !!this.PARTS[key];
    },

    html(key, extraClass = '') {
        if (key == null || key === '') return '';
        const parts = this.PARTS[key];
        if (!parts) return this.missing(key);
        const cls = extraClass ? ` ${extraClass}` : '';
        return `<span class="px-icon px-icon--${key}${cls}" aria-hidden="true">`
            + parts.map(p => `<i class="p-${p}"></i>`).join('')
            + `</span>`;
    },

    suit(ch) {
        const key = this.SUIT_KEYS[ch];
        return key && this.PARTS[key] ? this.html(key) : ch;
    },

    // `{i:key}` tokens inside message strings → icon HTML
    expand(str) {
        return String(str).replace(/\{i:([a-z0-9-]+)\}/g, (_, k) => this.html(k));
    },

    // Fill static placeholders: <span data-icon="action-hit"></span>
    hydrate(root = document) {
        root.querySelectorAll('[data-icon]').forEach(el => {
            el.outerHTML = this.html(el.getAttribute('data-icon'), el.className);
        });
    },

    missing(key) {
        if (!this.STRICT) return String(key);
        if (!this._warned[key]) {
            this._warned[key] = true;
            console.warn(`IconSprites: no icon for "${key}"`);
        }
        return `<span class="px-icon px-icon--missing" title="${String(key).replace(/"/g, '')}" aria-hidden="true"></span>`;
    }
};

// Icon registry: key -> part names (art lives in icons.css)
// @gen:start
IconSprites.define({
    // Glyphs: card suits (currentColor, no outline, 1em box so they sit in card text)
    'suit-spade': 'point lobe-l lobe-r stem',
    'suit-heart': 'lobe-l lobe-r tip',
    'suit-diamond': 'gem',
    'suit-club': 'top left right core stem',
    // Glyphs: UI
    'ui-warning': 'sign shade bar dot',
    'ui-arrow-left': 'head shaft',
    'ui-contract': 'roll-top sheet lines roll-bottom seal',
    'ui-deck-skull': 'cranium jaw eye-l eye-r nose teeth',
    // Actions
    'action-hit': 'sleeve hand fingers thumb knuckle',
    'action-stand': 'thumb fingers palm seps crease',
    'action-double': 'stack-l stack-r plus-h plus-v',
    'action-split': 'blade-a blade-b ring-l ring-r pivot',
    // Map rooms
    'room-normal': 'card pattern',
    'room-elite': 'blade-a guard-a grip-a blade-b guard-b grip-b',
    'room-event': 'tile q-top q-left q-right q-mid q-stem dot',
    'room-shop': 'posts awning counter coin',
    'room-rest': 'mattress pillow frame legs z-big z-small',
    'room-treasure': 'lid gold shine body band lock',
    'room-gamble': 'cabinet window reels tray lever knob',
    'room-boss': 'horn-l horn-r door bands slit ring',
    'room-start': 'frame light door knob',
    // Bosses (mini heads, colours from the dealer sprites)
    'boss-pitboss': 'hair head lens-l lens-r bridge eyes mouth tie',
    'boss-ladyluck': 'hair head blindfold smile coin',
    'boss-loanshark': 'fin head belly eyes teeth',
    'boss-countess': 'hair head peak eyes mouth fang-l fang-r drop',
    'boss-twins': 'head-l head-r eyes-l eyes-r mouths collar',
    'boss-grandmaster': 'crown head eyes monocle chain mouth',
    'boss-croupier': 'hat brim head eyes mustache chip',
    'boss-hangman': 'head eye-l eye-r frown rope knot loop',
    'boss-jester': 'hat bell-l bell-r head eyes grin teeth',
    'boss-bookie': 'head visor eyes mouth cig ember ledger',
    'boss-widow': 'head veil eyes lips legs spider',
    'boss-auditor': 'hair head glasses eyes mouth board clip lines',
    'boss-satan': 'horn-l horn-r head eyes pupils mouth fang-l fang-r goatee',
    // Elites
    'elite-card-shark': 'sea fin pip wake',
    'elite-timekeeper': 'chain crown case face hand-h hand-m',
    'elite-collector': 'lip neck body band glint base',
    'elite-mirror': 'frame glass figure-head figure-body stand',
    'elite-high-roller': 'side tower top',
    'elite-trickster': 'card swirl swirl-in plus-h plus-v minus',
    'elite-banker': 'door ring spoke-v spoke-h hub bolts',
    'elite-phantom': 'body eyes card',
    // Dealer perks
    'dperk-stand-on-18': 'face shine waist base plaque',
    'dperk-hit-soft-17': 'card crack fist claws',
    'dperk-peek-hole': 'card flap eye iris pupil',
    'dperk-fast-hands': 'streaks glove seps cuff',
    'dperk-tax-collector': 'coin tin slot label dollar',
    'dperk-house-edge': 'cliff grass house roof door',
    'dperk-card-shark': 'back deck fin',
    // Perks
    'perk-peek': 'card eye iris pupil glint',
    'perk-lucky7': 'tile bar stem',
    'perk-insurance': 'paper lines stamp stamp-bar',
    'perk-counter': 'brain fold curls plus-h plus-v minus',
    'perk-lucky-charm': 'outer white light pupil',
    'perk-second-chance': 'arc head card pip',
    'perk-double-or-nothing': 'die-a pips-a die-b pip-b',
    'perk-shield': 'shield inner flame core',
    'perk-thief': 'coin palm finger-top finger-bottom',
    'perk-meditation': 'coin petal-l petal-r petal-m base',
    'perk-quick-draw': 'card bolt',
    'perk-greed': 'gem top core shine',
    'perk-vampiric': 'jaw fang-l fang-r drop drop-2',
    'perk-last-stand': 'upper fore bicep fist bandage spot',
    'perk-double-down': 'brim crown band face glasses glint',
    // Side-bet perks
    'sbperk-pair-hunter': 'card-a card-b pip-a pip-b handle glass',
    'sbperk-poker-face': 'strap mask eyes mouth',
    'sbperk-side-show': 'pole flag tent door',
    'sbperk-side-master': 'handle-l handle-r cup shine stem base',
    'sbperk-lucky-start': 'trail star',
    'sbperk-side-insurance': 'ring',
    'sbperk-double-down-21': 'point lobe-l lobe-r stem digits',
    'sbperk-perfect-streak': 'chip-1 chip-2 chip-3 star-a star-b star-c',
    // Relics
    'relic-lucky-chip': 'chip inner leaves stem',
    'relic-devils-dice': 'horn-l horn-r die pips',
    'relic-snake-eyes': 'die-a die-b pips body head eye tongue',
    'relic-ace-in-hole': 'sleeve cuff link card ace pip',
    'relic-blood-pact': 'vane spine nib drop',
    'relic-golden-horseshoe': 'shoe nails shine',
    'relic-rabbit-foot': 'ring chain foot toes',
    'relic-cursed-mirror': 'handle frame glass crack',
    'relic-heavy-wallet': 'bills wallet flap clasp weight-ring weight',
    'relic-gamblers-bane': 'chip cranium eyes nose teeth gaps',
    'relic-phoenix-feather': 'vane glow shaft',
    'relic-card-shark': 'cord beads tooth shade',
    // Curses
    'curse-bad-luck': 'tail body head ear-l ear-r eyes',
    'curse-heavy-debt': 'link-a link-b ball shine dollar slash',
    'curse-shaky': 'shake fingers hand seps sweat',
    'curse-marked': 'card ring cross-h cross-v dot',
    'curse-taxed': 'coin inner dollar slash',
    'curse-paranoid': 'dark eye-l eye-r pupils brows',
    'curse-impatient': 'bell-l bell-r legs body face hand-h hand-m ring',
    'curse-poor-eyesight': 'lens-l lens-r bridge crack',
    // Contracts
    'contract-win-streak': 'flame core chip',
    'contract-bankroll': 'tie bag roof house door',
    'contract-elite-clear': 'paper title face text x-a x-b',
    'contract-blackjack': 'card-k crown card-a ace pip',
    'contract-split-win': 'half-l half-r pip-l pip-r',
    'contract-hands-won': 'board tallies slash',
    'contract-defeat-satan': 'sheet lines seal-horns seal seal-mark',
    // Events
    'event-mysterious-stranger': 'cloak hood eyes',
    'event-devil-deal': 'spark sleeve-l hand sleeve-r claw nails',
    'event-lost-wallet': 'wallet flap coins',
    'event-card-gambler': 'card-1 card-2 card-3 pip hand thumb',
    'event-cursed-chest': 'lid gap eyes body chain lock',
    'event-fortune-teller': 'ball swirl stand',
    'event-black-market': 'collar lining coat-l coat-r watch vial goods',
    'event-blessed-shrine': 'glow top beam posts plaque',
    'event-drunk-gambler': 'mug sheen handle foam bubbles',
    'event-breaking-news': 'antenna-l antenna-r body screen image headline knobs',
    // Shop items
    'shop-heal-small': 'band pad holes',
    'shop-heal-medium': 'left right shine',
    'shop-heal-large': 'cross-v cross-h handle blade',
    'shop-remove-curse': 'cork neck flask cross-v cross-h shine',
    'shop-random-perk': 'box lid q-top q-right q-mid q-stem dot',
    'shop-random-relic': 'bow-l bow-r box lid ribbon',
    'shop-extra-life': 'cork vial glow tuft',
    'shop-deck-peek': 'deck-back deck pip sheen',
    'shop-reduce-bet': 'ticket stub star',
    'shop-refresh': 'crate slats arc head',
    // Rest options
    'rest-rest': 'pillow crease z',
    'rest-meditate': 'flame core wick wax drip',
    'rest-train': 'bar plate-l inner-l plate-r inner-r',
    'rest-gamble': 'chip inner q-top q-right q-mid q-stem dot',
    // Gamble games
    'game-coin-flip': 'arc coin edge lines',
    'game-dice-roll': 'die shade pips',
    'game-wheel-spin': 'wheel hub pointer',
    'game-slots': 'frame windows bars stems'
});
// @gen:end
