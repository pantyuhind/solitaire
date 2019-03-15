import gameStatus from "../gameStatus";

function makeAutomaticSteps() {

    const autoSteeper = {};
    const checker = document.getElementById('autoStep');

    let autoStep = checker.checked;

    checker.addEventListener('change', function() {
        autoStep = this.checked;
        if (autoStep) autoSteeper.go();
    });

    autoSteeper.go = () => {
        if (!autoStep) return;
        const homeSlot = gameStatus.home.getAvailablePiles();
        if (!homeSlot) return;
        const card = homeSlot.acceptedCards[0];
        card.moveToElement(homeSlot.element).then(() => {
            switch (card.state) {
                case 'laid': {
                    gameStatus.store.dropFromLaidToHome({homeSlot: homeSlot.index, pile: card.pile});
                    break;
                }
                case 'slot': {
                    gameStatus.store.dropFromSlotToHome({slot: card.slot, homeSlot: homeSlot.index});
                    break;
                }
            }
        });
    };

    autoSteeper.go();

    return autoSteeper;

}

export default makeAutomaticSteps;