import {
    DROP_FROM_LAID_TO_HOME,
    DROP_FROM_LAID_TO_LAID,
    DROP_FROM_LAID_TO_SLOT, DROP_FROM_SLOT_TO_HOME, DROP_FROM_SLOT_TO_LAID,
    DROP_FROM_SLOT_TO_SLOT
} from '../constants'

import {
    dropFromLaidToLaid,
    dropFromLaidToSlot,
    dropFromSlotToSlot,
    dropFromSlotToLaid,
    dropFromLaidToHome,
    dropFromSlotToHome
} from "./fn";

import defaultState from "./defaultState";


export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case DROP_FROM_SLOT_TO_SLOT: {
            return dropFromSlotToSlot(state, action.payload);
        }
        case DROP_FROM_LAID_TO_LAID: {
            return dropFromLaidToLaid(state, action.payload);
        }
        case DROP_FROM_LAID_TO_SLOT: {
            return dropFromLaidToSlot(state, action.payload);
        }
        case DROP_FROM_SLOT_TO_LAID: {
            return dropFromSlotToLaid(state, action.payload);
        }
        case DROP_FROM_LAID_TO_HOME: {
            return dropFromLaidToHome(state, action.payload);
        }
        case DROP_FROM_SLOT_TO_HOME: {
            return dropFromSlotToHome(state, action.payload);
        }
        default: {
            return state;
        }
    }
}