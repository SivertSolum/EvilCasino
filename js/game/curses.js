// EVIL CASINO - Curse effects
// Lookups + hooks for every CURSES entry in config.js. game.js calls these at
// the relevant points in the hand; numbers come from each curse's `value`.

Object.assign(EvilCasino.prototype, {
    hasCurse(curseId) {
        return !!(this.activeCurses && this.activeCurses.some(c => c.id === curseId));
    },

    getCurse(curseId) {
        return (this.activeCurses && this.activeCurses.find(c => c.id === curseId)) || null;
    },

    // Body-level classes for curses that are pure presentation (Poor Eyesight)
    syncCurseEffects() {
        document.body.classList.toggle('curse-hidden-suits', this.hasCurse('poorEyesight'));
    },

    // Heavy Debt: flat cost per hand
    getCurseHandCost() {
        const debt = this.getCurse('heavyDebt');
        return debt ? debt.value : 0;
    },

    // Bad Luck: extra loss on a lost hand (called from endRound)
    applyCurseLoss() {
        const badLuck = this.getCurse('badLuck');
        if (!badLuck) return;
        const extra = Math.min(badLuck.value, this.money);
        if (extra <= 0) return;
        this.money -= extra;
        this.showMessage(`${badLuck.icon} Bad Luck: -$${extra} extra!`, 'lose');
    },

    // Casino Tax: shrink a win payout (same convention as High Roller's multiplier)
    applyCurseWinTax(payout) {
        const tax = this.getCurse('taxed');
        return tax ? payout * (1 - tax.value) : payout;
    },

    // Shaky Hands: can't stand on 17..value
    curseBlocksStand() {
        const shaky = this.getCurse('shaky');
        if (!shaky || !this.gameInProgress) return false;
        const hand = this.isSplitHand ? this.splitHands[this.currentSplitHandIndex] : this.playerHand;
        if (!hand || hand.length === 0) return false;
        const score = this.calculateScore(hand, true);
        return score >= 17 && score <= shaky.value;
    },

    // Call only where control returns to the player (it may re-enable STAND)
    syncStandButton() {
        if (!this.standBtn || !this.hasCurse('shaky') || !this.gameInProgress) return;
        this.standBtn.disabled = this.curseBlocksStand();
    },

    // Marked Cards: the dealer plays against your actual hand.
    // Returns true/false to override the dealer's normal hit decision, or null to keep it.
    curseDealerDecision(dealerScore) {
        if (!this.hasCurse('marked') || this.isSplitHand) return null;
        const playerScore = this.calculateScore(this.playerHand, true);
        if (playerScore > 21 || dealerScore >= 21) return null;
        if (dealerScore > playerScore) return false; // already winning: stand
        if (dealerScore < playerScore) return true;  // losing: keep hitting
        return null;                                 // tie: house rules
    },

    // Paranoid: hide the player's score while the hand is live
    curseHidesScore() {
        return this.gameInProgress && this.hasCurse('paranoid');
    },

    // Impatient: decision countdown. One shared interval across game instances,
    // since a quit-to-menu leaves the old instance alive.
    armDecisionTimer() {
        this.disarmDecisionTimer();
        const curse = this.getCurse('impatient');
        if (!curse) return;

        const handSignature = () => this.isSplitHand
            ? `s${this.currentSplitHandIndex}:${this.splitHands.map(h => h.length).join(',')}`
            : `p${this.playerHand.length}`;

        let remaining = curse.value;
        let signature = handSignature();
        this.renderDecisionTimer(remaining);

        EvilCasino._decisionTimer = setInterval(() => {
            if (window.game !== this || !this.gameInProgress) {
                this.disarmDecisionTimer();
                return;
            }
            // Pause while cards are moving or a popup is up
            if (this.isProcessingAction || this.isPopupOpen()) return;

            const sig = handSignature();
            if (sig !== signature) {
                signature = sig;
                remaining = curse.value;
                this.renderDecisionTimer(remaining);
                return;
            }

            remaining--;
            this.renderDecisionTimer(remaining);
            if (remaining > 0) return;

            this.showMessage(this.getRandomMessage(MESSAGES.curses.impatientTimeout), 'lose');
            if (this.curseBlocksStand()) {
                // Forced hit; keep ticking (the new card resets the countdown)
                remaining = curse.value;
                this.hit();
            } else {
                this.disarmDecisionTimer();
                this.stand();
            }
        }, 1000);
    },

    disarmDecisionTimer() {
        if (EvilCasino._decisionTimer) {
            clearInterval(EvilCasino._decisionTimer);
            EvilCasino._decisionTimer = null;
        }
        const el = document.getElementById('curse-timer');
        if (el) el.classList.add('hidden');
    },

    renderDecisionTimer(remaining) {
        let el = document.getElementById('curse-timer');
        if (!el) {
            if (!this.gameControls) return;
            el = document.createElement('div');
            el.id = 'curse-timer';
            el.className = 'curse-timer';
            this.gameControls.prepend(el);
        }
        el.textContent = `DECIDE: ${remaining}`;
        el.classList.remove('hidden');
        el.classList.toggle('urgent', remaining <= 2);
    }
});
