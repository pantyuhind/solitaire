import interact from "interactjs";
import {acceptIdsToDrop, differentPosition} from "../funtions";
import gameStatus from "../gameStatus";
import last from "lodash/last"

class Pile {

    constructor(value, index) {
        this.value = value;
        this.index = index;
        const el = this.element = document.createElement('div');
        const drop = this.drop = document.createElement('div');
        el.className = `pile pile-${index}`;
        this.interact = interact(drop);
        this.update(value);
    }

    setDropPosition() {
        this.drop.className = `pile pile-drop pile-${this.index} grid-${this.size - 1}`;
    }

    isEmpty() {
        return this.value.length === 0
    }

    setDropZone() {
        const lastCard = this.getLastCard();
        const isEmpty = this.isEmpty();

        if ( !isEmpty && lastCard.isAce() ) {
            this.drop.style.display = 'none';
        } else if (this.drop.style.display === 'none') {
            this.drop.style.display = '';
        }
        //Todo: доработать

        const acc = isEmpty ? '.card.active' : acceptIdsToDrop(lastCard);

        this.interact.dropzone({

            accept: acc || '#helper-card',

            ondrop: (event) => {
                const target = event.relatedTarget.getInstance();
                if (target.pile === this.index) return;
                this.onDrop(target);
            }
        });

    }

    update(value) {
        this.value = value;
        this.size = value.length;
        this.setDropZone();
        this.setDropPosition();
    }

    getLastCard() {
        return gameStatus.cards[last(this.value)]
    }

    onDrop(target) {
        const toPile = this.index;
        const pileSeparator = target.grid;

        const dfs = target.connections.map((one, i) => {
            gameStatus.helperCard.setPosition(this.index, this.size + i);
            const diff = differentPosition(gameStatus.helperCard.element, one.element);
            gameStatus.helperCard.removePosition();
            return diff;
        });

        target.connections.forEach((one, i) => {
            const d = dfs[i];
            one.moveTo(d.x, d.y).then(() => {
               if (i === target.connections.length - 1) {

                   switch (target.state) {
                       case 'laid': {
                           gameStatus.store.dropFromLaidToLaid({pileSeparator, fromPile: target.pile, toPile});
                           break;
                       }
                       case 'slot': {
                           gameStatus.store.dropFromSlotToLaid({slot: target.slot, pile: toPile});
                           break;
                       }
                       case 'home': {

                       }
                   }

                   if (target.connections.length > 1) gameStatus.multiDrag = undefined;
               }
            });
        });
    }

    appendTo(context) {
        context.appendChild(this.drop);
        context.appendChild(this.element);
    }

}

export default Pile;