import { getLayout } from "./request"
import makeCards from "./constructors/makeCards"
import makeStore from './redux/store'
import gameStatus from "./gameStatus";
import HelperCard from "./components/HelperCard";
import makeSlots from "./constructors/makeSlots";
import Laid from "./components/Laid";
import makeHome from "./constructors/makeHome";
import makeAutomaticSteps from "./constructors/makeAutomaticSteps";

Promise.resolve()
    .then(() => getLayout())
    .then((answer) => {
        const {state, cards} = answer;
        gameStatus.helperCard = new HelperCard();
        gameStatus.slots = makeSlots(state.slots);
        gameStatus.cards = makeCards(cards, state.laid);
        gameStatus.laid = new Laid(state.laid);
        gameStatus.home = makeHome(state.home);
        gameStatus.store = makeStore(state);
        return gameStatus.cards.appendOnTable();
    })
    .then(() => {
        gameStatus.automaticSteper = makeAutomaticSteps();
    });