import reverse from "lodash/reverse";
import clone from "lodash/clone";
import last from "lodash/last";
import Pile from "./Pile"
import {canDrop} from "../funtions";
import gameStatus from "../gameStatus";
import {DRAGGABLE_CARD_Z_INDEX} from "../constants";

class Laid {

    constructor(laid) {
        this.piles = [];

        laid.forEach((pile, pileIndex) => {
            this.piles[pileIndex] = new Pile(pile, pileIndex);
        });

        const F = document.createDocumentFragment();

        this.piles.forEach(pile => {
            pile.appendTo(F);
        });

        document.getElementById('Grid').appendChild(F);

        this.update(laid, true);

    }

    set(value) {
        this.value = value;
    }

    get() {
        return this.value;
    }

    update(laid, isFirst) {

        this.set(laid);

        this.value.forEach((pile, pileIndex) => {

            pile.forEach((number, gridIndex) => {
                const card = gameStatus.cards[number];
                card.clear();
                card.setInLaid(pileIndex, gridIndex, isFirst);

                card.on('dblclick', (event) => {
                    const freeSlot = gameStatus.slots.getFree();
                    if (!freeSlot) return;
                    card.moveToElement(freeSlot.element).then(() => {
                        gameStatus.store.dropFromLaidToSlot({pile: pileIndex, slot: freeSlot.index});
                    });
                });

                card.on('contextmenu', (event) => {
                    if (gameStatus.hold) return;
                    event.preventDefault();
                    gameStatus.hold = true;
                    card.setZIndex(DRAGGABLE_CARD_Z_INDEX);
                    setTimeout(() => {
                        card.setZIndex('');
                        gameStatus.hold = false;
                    }, 1000);
                })

            });

            const connections = [];

            for (let i = pile.length - 1; i >= 0; i--) {
                const card = gameStatus.cards[pile[i]];
                const lastCard = last(connections);
                if (!connections.length || canDrop(lastCard, card)) {
                    connections.push(card);
                    card.connections = reverse(clone(connections));
                    card.makeDraggable();
                } else {
                    break
                }
            }


            this.piles[pileIndex].update(pile);

        });

    }

}


export default Laid;