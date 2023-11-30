const allChampDataURL = 'https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json';
const champImageURL = (champion) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion}_0.jpg`;
let championsJson;

const state = {
    playerDeck: document.getElementsByClassName('player-deck')[0],
    enemyDeck: document.getElementsByClassName('enemy-deck')[0],
    playerVersus: document.getElementById('versus-player-card'),
    enemyVersus: document.getElementById('versus-enemy-card')
}

async function getChampionsData() {
    return (await fetch(new Request(allChampDataURL))).json();
}

function getRandomChampion() {
    const champArray = Object.values(championsJson.data);
    const randomIndex = Math.floor((Math.random() * champArray.length));
    return champArray[randomIndex];
}

async function getChampionImageByName(name) {
    return fetch(new Request(champImageURL(name)))
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob));
}

function selectCard(event) {
    const selectedCard = event.target;

    // Atualizar carta no versus para o jogador
    state.playerVersus.src = selectedCard.src;

    // deletar carta do jogador
    document.getElementById(selectedCard.id).remove();

    // deletar carto do inimigo

    //criar carta no versus para o inimigo
}

async function drawCards(amount, isPlayer) {
    for (i = 0; i < amount; i++) {
        const cardImage = document.createElement('img');
        const champion = getRandomChampion();
        cardImage.src = await getChampionImageByName(champion.id);
        cardImage.classList.add('deck-card');
        cardImage.id = champion.id;
        if (isPlayer) {
            cardImage.addEventListener('click', selectCard);
            state.playerDeck.appendChild(cardImage);
        } else {
            state.enemyDeck.appendChild(cardImage);
        }
    }
}

async function startGame() {
    championsJson = await getChampionsData();
    await drawCards(5, true);
    drawCards(5, false);
}

startGame();