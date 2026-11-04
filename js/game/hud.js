// EVIL CASINO - HUD (run status bar, contract progress, perk badges, rule banner)
// Extends EvilCasino after game.js loads, before roguelike.js.

Object.assign(EvilCasino.prototype, {
    cacheHudElements() {
        if (this._hudCached) return;
        this._hudCached = true;
        this.floorTotalEl = document.getElementById('floor-total');
        this.contractStatEl = document.getElementById('contract-stat');
        this.ruleBannerEl = document.getElementById('rule-banner');
        this.ruleBannerTagEl = document.getElementById('rule-banner-tag');
        this.ruleBannerTextEl = document.getElementById('rule-banner-text');
        this.ruleBannerWarnEl = document.getElementById('rule-banner-warn');
        this.setupActionQuips();
        this.setupTrackerToggle();
        this.renderTrackerCompact();
    },

    // DOM outlives game instances (menu → new run), so bind listeners once per element
    bindOnce(el, key) {
        if (!el || el.dataset[key]) return false;
        el.dataset[key] = '1';
        return true;
    },

    // === HISTORY (last 5 as pips; score on hover) ===
    renderHistoryList() {
        if (!this.historyListEl) return;
        const shown = 5;
        const recent = (this.roundHistory || []).slice(0, shown);
        let pips = '';
        for (let i = 0; i < shown; i++) {
            const h = recent[i];
            pips += h
                ? `<span class="history-pip ${h.result}" title="${h.player} vs ${h.dealer}">${h.symbol}</span>`
                : `<span class="history-pip placeholder"></span>`;
        }
        const last = recent[0];
        const lastLine = last
            ? `<span class="history-last ${last.result}">LAST: ${last.player} vs ${last.dealer}</span>`
            : `<span class="history-last placeholder">No hands yet</span>`;
        this.historyListEl.innerHTML = `<div class="history-pips">${pips}</div>${lastLine}`;
    },

    // === CARD TRACKER (compact rank counts by default, full grid on demand) ===
    setupTrackerToggle() {
        const btn = document.getElementById('tracker-toggle');
        if (!this.bindOnce(btn, 'hudBound')) return;
        btn.addEventListener('click', () => {
            const full = document.getElementById('tracker-full');
            const compact = document.getElementById('tracker-compact');
            const showFull = full.classList.contains('hidden');
            full.classList.toggle('hidden', !showFull);
            compact.classList.toggle('hidden', showFull);
            btn.textContent = showFull ? 'COMPACT' : 'FULL GRID';
        });
    },

    renderTrackerCompact() {
        const el = document.getElementById('tracker-compact');
        if (!el || typeof CONFIG === 'undefined') return;
        const perRank = CONFIG.SUITS.length;
        const tens = ['10', 'J', 'Q', 'K'];
        let totalLeft = 0;
        let tensLeft = 0;
        let rows = '';
        CONFIG.VALUES.forEach(value => {
            const cards = document.querySelectorAll(`.tracker-card[data-card^="${value}"]`);
            let left = 0;
            cards.forEach(c => {
                // data-card^="1" would also match "10", so compare the rank exactly
                if (c.dataset.card.slice(0, -1) === value && !c.classList.contains('played')) left++;
            });
            totalLeft += left;
            if (tens.includes(value)) tensLeft += left;
            let pips = '';
            for (let i = 0; i < perRank; i++) {
                pips += `<span class="tracker-row-pip${i < left ? ' left' : ''}"></span>`;
            }
            const cls = `tracker-row${tens.includes(value) ? ' tens' : ''}${left === 0 ? ' empty' : ''}`;
            rows += `<div class="${cls}"><span>${value}</span><span class="tracker-row-pips">${pips}</span><span class="tracker-row-count">${left}</span></div>`;
        });
        const totalCards = CONFIG.VALUES.length * perRank;
        rows += `<div class="tracker-summary">`
            + `<span>10-VALUE <b>${tensLeft}/${tens.length * perRank}</b></span>`
            + `<span>LEFT <b>${totalLeft}/${totalCards}</b></span>`
            + `</div>`;
        el.innerHTML = rows;
    },

    // === ACTION QUIPS (sarcasm on hover / disabled, never in the button label) ===
    setupActionQuips() {
        if (typeof ACTION_QUIPS === 'undefined') return;
        document.querySelectorAll('.action-btn[data-action]').forEach(btn => {
            const quips = ACTION_QUIPS[btn.dataset.action];
            if (!quips || !this.bindOnce(btn, 'quipBound')) return;
            if (quips.off) btn.dataset.quipOff = quips.off;
            const pick = () => {
                const pool = quips.hover || [];
                if (pool.length) btn.dataset.quip = pool[Math.floor(Math.random() * pool.length)];
            };
            pick();
            btn.addEventListener('mouseenter', pick);
        });
    },

    updateDisplay() {
        this.moneyDisplay.textContent = `$${this.money}`;

        if (this.money < 100) {
            this.moneyDisplay.classList.add('losing');
        } else {
            this.moneyDisplay.classList.remove('losing');
        }

        if (this._pendingMoneyDelta && typeof GameAnimations !== 'undefined') {
            GameAnimations.animateMoneyChange(this._pendingMoneyDelta, this.moneyDisplay);
            this._pendingMoneyDelta = 0;
        }
        this._lastMoney = this.money;
    },

    updateRoguelikeDisplay() {
        this.cacheHudElements();
        if (typeof this.syncCurseEffects === 'function') this.syncCurseEffects();

        if (this.currentFloorEl) this.currentFloorEl.textContent = this.currentFloor;
        if (this.floorTotalEl && typeof CONFIG !== 'undefined') {
            this.floorTotalEl.textContent = `/${CONFIG.TOTAL_FLOORS}`;
        }
        if (this.winStreakEl) this.winStreakEl.textContent = this.floorWins != null ? this.floorWins : this.winStreak;
        if (this.winsNeededEl) {
            // Hide old streak fraction when using contracts
            this.winsNeededEl.textContent = this.contract ? '' : this.winsNeededForUpgrade;
        }

        this.renderContractStatus();
        this.renderPerkBadges();
        this.refreshRuleBanner();
    },

    // === CONTRACT ===
    renderContractStatus() {
        if (this.escapeGoalEl) {
            const c = this.contract;
            this.escapeGoalEl.innerHTML = c ? `${IconSprites.html(c.icon)} ${c.name}` : `$${this.escapeGoal}`;
            if (c && typeof this.getContractGoalText === 'function') {
                this.escapeGoalEl.title = this.getContractGoalText();
            }
        }

        if (this.contractStatEl) {
            this.contractStatEl.classList.toggle('complete', !!this.contractComplete);
            this.contractStatEl.classList.toggle('failed', !!this.contractFailed);
        }

        if (!this.contractHudEl) return;
        const p = typeof this.getContractProgress === 'function' ? this.getContractProgress() : null;
        if (!p) {
            this.contractHudEl.innerHTML = '';
            return;
        }
        this.contractHudEl.innerHTML = this.buildContractProgressHtml(p);
    },

    // Shared by the status bar and the floor map
    buildContractProgressHtml(p) {
        let meter;
        if (p.target <= 6) {
            let pips = '';
            for (let i = 0; i < p.target; i++) {
                pips += `<span class="contract-pip${i < p.current ? ' filled' : ''}"></span>`;
            }
            meter = `<span class="contract-pips">${pips}</span>`;
        } else {
            const pct = Math.max(0, Math.min(100, Math.round((p.current / p.target) * 100)));
            meter = `<span class="contract-bar"><span class="contract-bar-fill" style="width:${pct}%"></span></span>`;
        }
        let status = p.text;
        if (p.complete) status = 'DONE';
        else if (p.failed) status = 'FAILED';
        const extra = p.extra && !p.complete && !p.failed
            ? `<span class="contract-extra">${p.extra}</span>`
            : '';
        return `${meter}<span class="contract-count">${status}</span>${extra}`;
    },

    // === PERKS ===
    renderPerkBadges() {
        if (!this.activeUpgradesEl) return;
        if (!this.activePerks || this.activePerks.length === 0) {
            this.activeUpgradesEl.innerHTML = '<span class="perks-empty">None yet...</span>';
            return;
        }
        this.activeUpgradesEl.innerHTML = this.activePerks.map(p => this.buildPerkBadgeHtml(p)).join('');
        this.setupPerkTooltips();
    },

    // One badge look everywhere (status bar, shop strip)
    buildPerkBadgeHtml(p) {
        const uses = p.maxUses ? `<sup class="perk-uses">${p.uses}</sup>` : '';
        const spent = p.maxUses && p.uses <= 0 ? ' spent' : '';
        const kind = p.milestone ? ' side-bet' : '';
        return `<span class="perk-badge icon-only${kind}${spent}" data-perk-id="${p.id}" data-perk-icon="${p.icon}" data-perk-name="${p.name}" data-perk-desc="${p.desc}">${IconSprites.html(p.icon)}${uses}</span>`;
    },

    // === SHOP ===
    renderPreRoundShopItems() {
        if (!this.preRoundShopItems) return;

        this.preRoundShopItems.innerHTML = '';

        if (!this.shopInventory || this.shopInventory.length === 0) {
            this.preRoundShopItems.innerHTML = '<p class="shop-empty">No perks available!</p>';
            return;
        }

        const stamps = (typeof MESSAGES !== 'undefined' && MESSAGES.tooPoor) || ['TOO POOR'];

        this.shopInventory.forEach((perk, index) => {
            const canAfford = this.money >= perk.cost;
            const rarity = perk.rarity || 'common';
            const kindBadge = perk.maxUses
                ? `<span class="perk-kind uses" title="Limited uses, refills each floor">${perk.maxUses}× / FLOOR</span>`
                : `<span class="perk-kind passive" title="Always on">∞ PASSIVE</span>`;

            const btn = document.createElement('button');
            btn.className = `perk-shop-item rarity-${rarity}${canAfford ? '' : ' cannot-afford'}`;
            if (!canAfford) btn.dataset.stamp = stamps[Math.floor(Math.random() * stamps.length)];
            btn.innerHTML = `
                <span class="perk-rarity">${rarity.toUpperCase()}</span>
                <span class="perk-icon">${IconSprites.html(perk.icon)}</span>
                <span class="perk-name">${perk.name}</span>
                ${kindBadge}
                <span class="perk-desc">${perk.desc}</span>
                <span class="perk-cost ${canAfford ? 'affordable' : 'expensive'}">$${perk.cost}</span>
            `;

            if (canAfford) {
                btn.addEventListener('click', () => this.buyPerkFromShop(index));
            } else {
                btn.disabled = true;
            }

            this.preRoundShopItems.appendChild(btn);
        });
    },

    renderActivePerksInShop() {
        if (!this.shopActivePerksListEl) return;

        if (!this.activePerks || this.activePerks.length === 0) {
            this.shopActivePerksListEl.innerHTML = '<span class="perks-empty">None yet...</span>';
            return;
        }
        this.shopActivePerksListEl.innerHTML = this.activePerks.map(p => this.buildPerkBadgeHtml(p)).join('');
        this.setupPerkTooltips(this.shopActivePerksListEl);
    },

    setupPerkTooltips(container = this.activeUpgradesEl) {
        if (!this.perkTooltip || !container) return;

        const perkBadges = container.querySelectorAll('.perk-badge[data-perk-id]');
        perkBadges.forEach(badge => {
            badge.addEventListener('mouseenter', (e) => this.showPerkTooltip(e, badge));
            badge.addEventListener('mouseleave', () => this.hidePerkTooltip());
        });
    },

    showPerkTooltip(e, badge) {
        if (!this.perkTooltip) return;

        const name = badge.getAttribute('data-perk-name');
        const desc = badge.getAttribute('data-perk-desc');

        this.perkTooltipName.innerHTML = `${IconSprites.html(badge.getAttribute('data-perk-icon'))} ${name}`;
        this.perkTooltipDesc.textContent = desc;
        this.perkTooltip.classList.remove('hidden');

        this.positionPerkTooltip(badge);
    },

    positionPerkTooltip(badge) {
        if (!this.perkTooltip || this.perkTooltip.classList.contains('hidden')) return;

        // Get badge position in viewport
        const rect = badge.getBoundingClientRect();

        // Position tooltip centered above the badge
        const x = rect.left + rect.width / 2;
        const y = rect.top;

        this.perkTooltip.style.left = `${x}px`;
        this.perkTooltip.style.top = `${y}px`;
        this.perkTooltip.style.transform = 'translate(-50%, -100%)';

        // Status bar sits at the top of the stage — flip below if it would clip
        const tooltipRect = this.perkTooltip.getBoundingClientRect();
        if (tooltipRect.top < 10) {
            this.perkTooltip.style.top = `${rect.bottom + 15}px`;
            this.perkTooltip.style.transform = 'translate(-50%, 0)';
        }

        // Check horizontal bounds
        const leftOverflow = tooltipRect.left < 10;
        const rightOverflow = tooltipRect.right > window.innerWidth - 10;

        if (leftOverflow) {
            this.perkTooltip.style.left = `${tooltipRect.width / 2 + 10}px`;
        } else if (rightOverflow) {
            this.perkTooltip.style.left = `${window.innerWidth - tooltipRect.width / 2 - 10}px`;
        }
    },

    hidePerkTooltip() {
        if (this.perkTooltip) {
            this.perkTooltip.classList.add('hidden');
        }
    },

    // === RULE BANNER (boss / elite special rule, always visible on the table) ===
    refreshRuleBanner() {
        this.cacheHudElements();
        if (!this.ruleBannerEl) return;

        let tag = null;
        let rule = null;
        let kind = '';
        if (this.isBossFight && this.currentBoss) {
            tag = this.currentBoss.id === 'satan' ? 'FINAL RULE' : 'BOSS RULE';
            rule = `${IconSprites.html(this.currentBoss.icon || '🔥')} ${this.currentBoss.rule}`;
            kind = 'boss';
        } else if (this.isEliteFight && this.currentElite) {
            tag = 'ELITE RULE';
            rule = `${IconSprites.html(this.currentElite.icon || '⚔️')} ${this.currentElite.rule}`;
            kind = 'elite';
        }

        if (!rule) {
            this.ruleBannerEl.classList.add('hidden');
            return;
        }

        this.ruleBannerEl.classList.remove('hidden', 'boss', 'elite');
        this.ruleBannerEl.classList.add(kind);
        if (this.ruleBannerTagEl) this.ruleBannerTagEl.textContent = tag;
        if (this.ruleBannerTextEl) this.ruleBannerTextEl.innerHTML = rule;
        if (this.ruleBannerWarnEl) {
            const atRisk = kind === 'boss'
                && !this.contractComplete
                && this.contract?.type !== 'defeatBoss';
            this.ruleBannerWarnEl.classList.toggle('hidden', !atRisk);
        }
    }
});
