const allChampDataURL = 'https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json';
const champImageURL = (champion) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion}_0.jpg`;
let championsJson;

const state = {
    playerDeck: document.getElementById('player-deck'),
    enemyDeck: document.getElementById('enemy-deck'),
    playerVersus: document.getElementById('versus-player-card'),
    enemyVersus: document.getElementById('versus-enemy-card'),
    cardDetail: {
        cardTitle: document.getElementById('detail-card-title'),
        cardSubTitle: document.getElementById('detail-card-subtitle'),
        cardImage: document.getElementById('detail-card-image'),
        cardPower: document.getElementById('detail-card-power'),
        cardDescription: document.getElementById('detail-card-description')
    }
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

function getRandomEnemyCard() {
    const cards = document.getElementById('enemy-deck').children;
    return cards.item(Math.floor(Math.random() * cards.length));
}

function selectCard(event) {
    const selectedCard = event.target;

    // Atualizar carta no versus para o jogador
    state.playerVersus.src = selectedCard.src;
    
    // Deletar carta do jogador
    selectedCard.remove();

    // Atualizar carta no versus para o inimigo
    const enemyCard = getRandomEnemyCard();
    state.enemyVersus.src = enemyCard.src;

    // Deletar carta do inimigo
    enemyCard.remove();
}

async function updateDetailSection(event) {
    const card = event.target;
    const champion = JSON.parse(card.dataset.champion);

    state.cardDetail.cardTitle.innerHTML = champion.name;
    state.cardDetail.cardSubTitle.innerHTML = champion.title;

    console.log(champion.info.difficulty);
    console.log(Number(champion.info.difficulty));

    state.cardDetail.cardPower.innerHTML = Number(champion.info.difficulty) * 500;
    state.cardDetail.cardDescription.innerHTML = champion.blurb;
    state.cardDetail.cardImage.src = await getChampionImageByName(champion.id);
}

async function drawCards(amount, isPlayer) {
    for (i = 0; i < amount; i++) {
        const cardImage = document.createElement('img');
        const champion = getRandomChampion();
        cardImage.dataset.champion = JSON.stringify(champion);
        cardImage.src = await getChampionImageByName(champion.id);
        cardImage.classList.add('deck-card');

        if (isPlayer) {
            cardImage.classList.add('player-deck-card');
            cardImage.addEventListener('click', selectCard);
            cardImage.addEventListener('mouseover', updateDetailSection);
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