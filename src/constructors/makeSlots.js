import interact from "interactjs";
import {differentPosition, returnCards} from "../funtions";
import gameStatus from "../gameStatus";
import isEqual from "lodash/isEqual"
import findIndex from "lodash/findIndex"

class Slot {

    constructor(value, index) {
        this.element = document.createElement('div');
        this.element.className = `slot slot-${index}`;
        this.interact = interact(this.element);
        this.value = value;
        this.index = index;

        this.interact.dropzone({

            accept: '.card.active',

            ondrop: (event) => {
                if (gameStatus.hold) return;

                const target = event.relatedTarget.getInstance();

                if (this.isBusy() || gameStatus.multiDrag) {
                    returnCards(target.connections);
                    return;
                }

                const diff = differentPosition(this.element, target.element);

                target.moveTo(diff.x, diff.y).then(() => {

                    switch (target.state) {
                        case 'laid': {
                            gameStatus.store.dropFromLaidToSlot({pile: target.pile, slot: index});
                            break;
                        }
                        case 'slot': {
                            gameStatus.store.dropFromSlotToSlot({fromSlot: target.slot, toSlot: index});
                            break;
                        }
                    }

                });

            }

        });

    }

    isBusy() {
        return this.value !== null;
    }

    update(value) {
        this.value = value;

        if (value === null) {
            return;
        }

        const card = this.card = gameStatus.cards[value];

        card.clear();

        card.state = 'slot';
        card.slot = this.index;
        card.connections = [ card ];
        card.element.classList.add('slot-' + this.index);
        card.makeDraggable();


    }

    append(ctx) {
        ctx.appendChild(this.element);
    }


}


export default function makeSlots(data) {

    const slots = {};
    const F = document.createDocumentFragment();
    let value = data;

    value.forEach((one, i) => {
        slots[i] = new Slot(one, i);
        slots[i].append(F);
    });
    document.getElementById('Grid').appendChild(F);

    slots.update = (newData) => {
        if ( isEqual(newData, value) ) return;
        value = newData;

        value.forEach((one, i) => {
            const slot = slots[i];
            if (slot.value === one) return;
            slot.update(one);
        });

    };

    slots.getFree = () => {
        const i = findIndex(value, (one) => one === null);
        if (i === -1) return false;
        return slots[i];
    };

    return slots;

}