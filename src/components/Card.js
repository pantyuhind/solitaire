import extend from "lodash/extend"
import EvEmitter from "ev-emitter";
import interact from 'interactjs'
import {ACE_RATE, DRAGGABLE_CARD_Z_INDEX} from "../constants";
import gameStatus from "../gameStatus";
import {differentPosition, returnCards} from "../funtions";

class Card {

    constructor(params) {
        extend(this, params);

        const el = this.element = document.createElement('div');
        el.className = `card unturned hold ${this.name}`;
        el.tabIndex = 0;
        el.id = this.name;

        this.x = this.y = 0;

        el.getInstance = () => this;

        el.addEventListener('dblclick', (event) => {
            this.emitEvent('dblclick', [event]);
        });

        el.addEventListener('contextmenu', (event) => {
            this.emitEvent('contextmenu', [event]);
        });

        el.addEventListener('transitionend', () => {
            this.emitEvent('transitionend');
        });

        this.interact = interact(el);

        this.interact.styleCursor(false);

        this.interact.draggable({
            inertia: false,

            onstart: (event) => {
                if (gameStatus.hold) return;
                this.emitEvent('dragstart', [event]);
            },

            onend: (event) => {
                if (gameStatus.hold) return;
                this.emitEvent('dragend', [event]);
            },

            onmove: (event) => {
                if (gameStatus.hold) return;
                this.emitEvent('dragmove', [event.dx, event.dy]);
            }
        });

    }

    goOnTable(index) {
        return new Promise(resolve => {
            this.element.classList.remove('unturned');
            this.element.classList.add('animate');
            this.setZIndex(DRAGGABLE_CARD_Z_INDEX + index);
            setTimeout(() => {
                this.element.classList.remove('hold');
                this.once('transitionend', () => {
                    this.element.classList.remove('animate');
                    this.setZIndex('');
                    resolve();
                })
            }, 0);
        });
    }

    setInLaid(pile, grid, isFirst) {

        if (!isFirst && this.state === 'laid' && this.grid === grid && this.pile === pile) return;

        if (!isFirst) {
            this.element.classList.remove('pile-' + this.pile);
            this.element.classList.remove('grid-' + this.grid);
        }

        this.state = 'laid';
        this.pile = pile;
        this.grid = grid;

        this.removePosition();

        this.element.classList.add('pile-' + this.pile);
        this.element.classList.add('grid-' + this.grid);
    }

    isAce() {
        return this.rate === ACE_RATE;
    }

    moveToElement(element) {
        const diff = differentPosition(element, this.element);
        return this.moveTo(diff.x, diff.y);
    }

    readyToHome() {
        if (this.state === 'slot') return true;
        else if (this.state === 'home') return false;

        return this.isDraging && this.connections.length === 1;

    }

    moveTo(x, y) {
        return new Promise(resolve => {
            gameStatus.hold = true;
            this.element.classList.add('return-back');
            setTimeout(() => {
                this.setTransform(this.x + x, this.y + y);
                this.once('transitionend', () => {
                    this.element.classList.remove('return-back');
                    this.element.classList.remove('dragging');
                    setTimeout(resolve, 0);
                });
            }, 0);
        });
    }

    setTransform(x, y) {
        this.element.style.transform = `translate(${x}px, ${y}px) translate3d(0, 0, 0)`;
    }

    getBack(index) {
        return new Promise(resolve => {
            this.element.classList.add('return-back');
            setTimeout(() => {
                this.removePosition();
                this.once('transitionend', () => {
                    this.element.classList.remove('return-back');
                    resolve();
                });
            }, 0);
        });
    }

    appendTo(ctx) {
        ctx.appendChild(this.element);
    }

    clear() {

        delete this.isDraging;
        delete this.connections;
        this.allOff();
        this.removePosition();
        this.element.classList.remove('active');

        if (this.state === 'laid') {
            this.element.classList.remove('pile-' + this.pile);
            this.element.classList.remove('grid-' + this.grid);
            delete this.pile;
            delete this.grid;
        } else if (this.state === 'slot') {
            this.element.classList.remove('slot-' + this.slot);
            delete this.slot;
        };

        delete this.state;


    }

    makeDraggable() {

        const { connections } = this;

        this.isDraging = true;
        this.element.classList.add('active');

        this.on('dragstart', () => {
            connections.forEach((card, index) => {
                card.onDragStart(index);
            });
            if (connections.length > 1) gameStatus.multiDrag = true;
        });

        this.on('dragmove', (x, y) => {
            connections.forEach(card => {
                card.setPosition(x, y);
            });
        });

        this.on('dragend', (event) => {
            if (event.relatedTarget !== null) return;
            returnCards(connections);
        });

    }

    onDragStart(index) {
        this.element.classList.add('dragging');
        this.setZIndex(DRAGGABLE_CARD_Z_INDEX + index);
        this.x = 0;
        this.y = 0;
    }

    setZIndex(value) {
        this.element.style.zIndex = value;
    }

    setPosition(x, y) {
        this.x += parseInt(x);
        this.y += parseInt(y);
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) translate3d(0, 0, 0)`;
    }

    removePosition() {
        this.x = 0;
        this.y = 0;
        this.element.style.transform = '';
        this.element.style.zIndex = '';
    }


}

extend( Card.prototype, EvEmitter.prototype );

export default Card;