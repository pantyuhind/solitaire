import cloneDeep from "lodash/cloneDeep"

export function dropFromLaidToLaid(state, payload) {
    const {pileSeparator, fromPile, toPile} = payload;
    const newState = cloneDeep(state);
    const { laid } = newState;
    laid[toPile] = laid[toPile].concat( laid[fromPile].splice(pileSeparator, laid[fromPile].length) );

    return newState;
}

export function dropFromLaidToSlot(state, payload) {
    const newState = cloneDeep(state);
    const { pile, slot } = payload;
    const { laid, slots } = newState;

    slots[slot] = laid[pile].splice(-1)[0];

    return newState;
}

export function dropFromSlotToSlot(state, payload) {
    const newState = cloneDeep(state);
    const { fromSlot, toSlot } = payload;
    const { slots } = newState;

    slots[toSlot] = slots[fromSlot];
    slots[fromSlot] = null;

    return newState;
}

export function dropFromSlotToLaid(state, payload) {
    const newState = cloneDeep(state);
    const { laid, slots } = newState;
    const { pile, slot } = payload;

    laid[pile].push(slots[slot]);
    slots[slot] = null;

    return newState;
}

export function dropFromLaidToHome(state, payload) {
    const newState = cloneDeep(state);
    const { laid, home } = newState;
    const { homeSlot, pile } = payload;

    home[homeSlot] = home[homeSlot].concat( laid[pile].splice(-1) );
    return newState;
}

export function dropFromSlotToHome(state, payload) {
    const newState = cloneDeep(state);
    const { slots, home } = newState;
    const { homeSlot, slot } = payload;
    home[homeSlot].push(slots[slot]);
    slots[slot] = null;

    return newState;
}