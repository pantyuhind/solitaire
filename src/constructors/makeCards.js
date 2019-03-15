import Card from "../components/Card";
import reverse from "lodash/reverse";
import clone from "lodash/clone";

function makeCards(cards, laid) {

    const deck = [];

    cards.forEach(params => {
        deck[params.number] = new Card(params);
    });

    const F = document.createDocumentFragment();
    const A = [];
    const size = laid.length;

    for (let i = 0; i < laid.length; i++) {
        for (let j = 0; j < laid[i].length; j++) {
            A[ size * j + i ] = laid[i][j];
        }
    }

    reverse(clone(A)).forEach(one => {
        deck[one].appendTo(F);
    });

    document.getElementById('Grid').appendChild(F);

    deck.appendOnTable = () => {
        return new Promise(resolve => {
            let index = 0;
            const interval = setInterval(() => {
                const card = deck[A[index]];
                card.goOnTable(index).then(() => {
                    if (index === A.length - 1) setTimeout(resolve, 500);
                });
                index++;
                if (index === A.length) clearInterval(interval);
            }, 105);


        });
    };


    return deck;

}

export default makeCards;