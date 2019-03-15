import 'es6-promise/auto'
import axios from 'axios'
import card_index from '@kartabita/card_index';
import defaultState from './redux/defaultState'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

export function getLayout() {

    const params = { idGame: 6 };

    return axios
        .get('http://www.kartabita.ru/desk.php', { params })
        .then(answer => answer.data)
        .then(data => {
            let pile = 0;
            let grid = 0;
            const cards = [];
            const laid = [];

            data.cards.forEach(n => {
                const card = card_index[n];

                if (pile >= 8) {
                    pile = 0;
                    grid++;
                }

                card.number = n;

                if (!laid[pile]) laid[pile] = [];
                laid[pile][grid] = n;

                pile++;

                cards.push(card);

            });

            return { cards, state: {...defaultState, laid} };
        });

}
