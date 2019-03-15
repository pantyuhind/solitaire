import { createStore } from "redux"
import reducer from "./reducer"
import gameStatus from "../gameStatus";
import {
    DROP_FROM_LAID_TO_HOME,
    DROP_FROM_LAID_TO_LAID,
    DROP_FROM_LAID_TO_SLOT,
    DROP_FROM_SLOT_TO_HOME,
    DROP_FROM_SLOT_TO_LAID,
    DROP_FROM_SLOT_TO_SLOT
} from "../constants";


export default function makeStore(initialState) {

    const store = createStore(reducer, initialState);

    store.subscribe(() => {
        const state = store.getState();
        const { laid, slots, home } = state;

        gameStatus.laid.update(laid);
        gameStatus.slots.update(slots);
        gameStatus.home.update(home);

        if (gameStatus.home.success()) {
            alert('Победа!');
            return;
        }

        gameStatus.automaticSteper.go();
        gameStatus.hold = false;

    });

    return {

        dropFromLaidToLaid: (payload) => {
            store.dispatch({
                type: DROP_FROM_LAID_TO_LAID,
                payload
            });
        },

        dropFromLaidToSlot: (payload) => {
            store.dispatch({
                type: DROP_FROM_LAID_TO_SLOT,
                payload
            });
        },

        dropFromSlotToSlot: (payload) => {
          store.dispatch({
              type: DROP_FROM_SLOT_TO_SLOT,
              payload
          })
        },

        dropFromSlotToLaid: (payload) => {
          store.dispatch({
              type: DROP_FROM_SLOT_TO_LAID,
              payload
          })
        },

        dropFromLaidToHome: (payload) => {
          store.dispatch({
              type: DROP_FROM_LAID_TO_HOME,
              payload
          })
        },

        dropFromSlotToHome: (payload) => {
          store.dispatch({
              type: DROP_FROM_SLOT_TO_HOME,
              payload
          })
        },

    };

};