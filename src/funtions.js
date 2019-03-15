import map from "lodash/map"
import filter from "lodash/filter"
import isArray from "lodash/isArray"
import {ACE_RATE} from "./constants";
import gameStatus from "./gameStatus";

export function returnCards(cards) {
    gameStatus.hold = true;
    const arr = isArray(cards) ? cards : [cards];
    arr.forEach((card, index) => {
        card.getBack(index).then(() => {
            if (index === 0) gameStatus.hold = false;
            if (arr.length > 1) gameStatus.multiDrag = undefined;
        });
    });
}

export function differentPosition(a, b) {

    const position = {
        a: a.getBoundingClientRect(),
        b: b.getBoundingClientRect()
    };

    const x = position.a.x - position.b.x;
    const y = position.a.y - position.b.y;

    return { x, y };

}

export function getPosition(element) {
    const a = element.getBoundingClientRect();
    const b = document.getElementById('Grid').getBoundingClientRect();
    const x = parseInt(a.x - b.x);
    const y = parseInt(a.y - b.y);
    return { x, y };
}

export function canDrop(a, b) {
    if (!b) return a.rate === ACE_RATE;
    return a.color !== b.color && a.rate + 1 === b.rate;
}

export function acceptToDrop(dropZone) {
    return filter(gameStatus.cards, (draggable) => {
        return canDrop(draggable, dropZone);
    });
}

export function acceptIdsToDrop(card) {
    return map(acceptToDrop(card), (one) => `#${one.name}.active`).join(', ');
}