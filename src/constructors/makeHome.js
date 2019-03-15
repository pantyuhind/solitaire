import interact from "interactjs";
import {ACE_RATE, HOME_SLOT_START_INDEX, KING_RATE} from "../constants";
import {differentPosition, returnCards} from "../funtions";
import gameStatus from "../gameStatus";
import card_index from '@kartabita/card_index';
import filter from 'lodash/filter'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import last from 'lodash/last'

class HomeSlot {

    constructor(data, index) {

        this.element = document.createElement('div');
        this.element.className = `slot slot-${HOME_SLOT_START_INDEX + index}`;
        this.interact = interact(this.element);
        this.value = data;
        this.index = index;
        this.rate = 0;
        this.acceptedCards = [];
        this.done = false;
        this.dropZone();

    }

    success() {
        this.done = true;
        this.element.style.display = 'none';
    }

    getAccepts() {
        if (isEmpty(this.value)) {

            const aces = filter(gameStatus.cards, (card) => {
                return card.rate === ACE_RATE && card.readyToHome();
            });

            if (!aces.length) {
                this.acceptedCards = [];
                return false;
            }

            this.acceptedCards = aces;
            const acesNames = aces.map(a => `#${a.name}.active`);
            return acesNames.join(',');
        }

        const card = find(gameStatus.cards, (c) => {
            return c.suit === this.suit && c.rate === this.rate + 1 && c.readyToHome();
        });

        if (card) {
            this.acceptedCards = [ card ];
            return `#${card.name}.active`;
        }

        this.acceptedCards = [];

        return false;
    }

    dropZone() {
        const acc = this.getAccepts();

        this.interact.dropzone({

            accept: acc,

            ondrop: (event) => {
                if (gameStatus.hold) return;
                const target = event.relatedTarget.getInstance();

                if (gameStatus.multiDrag) {
                    returnCards(target.connections);
                    return;
                }

                const diff = differentPosition(this.element, target.element);

                target.moveTo(diff.x, diff.y).then(() => {

                    switch (target.state) {
                        case 'laid': {
                            gameStatus.store.dropFromLaidToHome({pile: target.pile, homeSlot: this.index});
                            break;
                        }
                        case 'slot': {
                            gameStatus.store.dropFromSlotToHome({slot: target.slot, homeSlot: this.index});
                            break;
                        }
                    }

                });

            }

        });

    }

    update(data) {

        if ( !isEqual(this.value, data) ) {

            this.value = data;
            if (!this.suit) this.suit = card_index[this.value[0]].suit;
            this.rate++;

            const card = gameStatus.cards[last(this.value)];
            card.clear();
            card.element.classList.add('slot-' + (HOME_SLOT_START_INDEX + this.index));
            card.element.classList.add('no-event');
            card.setZIndex(card.rate);
            card.state = 'home';

            if (this.rate === KING_RATE) {
                this.success();
            }

        }

        this.dropZone();

    }

    append(ctx) {
        ctx.appendChild(this.element);
    }

}

function makeHome(data) {

    const home = {};
    home.length = 4;

    let value = data;
    const F = document.createDocumentFragment();

    value.forEach((one, i) => {
       home[i] = new HomeSlot(one, i);
       home[i].append(F);
    });

    document.getElementById('Grid').appendChild(F);

    home.update = (newData) => {
        value = newData;
        value.forEach((one, i) => {
            home[i].update(one);
        });
    };

    home.success = () => {
        for (let i = 0; i < home.length; i++) {
            const pile = home[i];
            if (!pile.done) {
                return false;
            }
        }
        return true;
    };

    home.getAvailablePiles = () => {

        for (let i = 0; i < home.length; i++) {
            const pile = home[i];
            if (pile.acceptedCards.length > 0) {
                return pile;
            }
        }
        return false;
    };

    return home;

}

export default makeHome



