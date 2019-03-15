import {getPosition} from "../funtions";

class HelperCard {

    constructor() {

        this.element = document.createElement('div');
        this.element.className = 'card card-helper';
        this.element.id = 'helper-card';

        document.getElementById('Grid').appendChild(this.element);

    }

    setPosition(pile, grid) {
        this.pile = pile;
        this.grid = grid;
        this.element.classList.add('pile-' + this.pile);
        this.element.classList.add('grid-' + this.grid);
    }

    removePosition() {
        this.element.classList.remove('pile-' + this.pile);
        this.element.classList.remove('grid-' + this.grid);
        delete this.pile;
        delete this.grid;
    }

}

export default HelperCard