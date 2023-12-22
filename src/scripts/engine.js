const allChampDataURL = 'https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json';
const champImageURL = (champion) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion}_0.jpg`;
let championsJson;

const state = {
    round: 0,
    wins: 0,
    loses: 0,
    draws: 0,
    playerDeck: document.getElementById('player-deck'),
    enemyDeck: document.getElementById('enemy-deck'),
    playerVersus: document.getElementById('versus-player-card'),
    enemyVersus: document.getElementById('versus-enemy-card'),
    matchResult: document.getElementById('match-result'),
    matchResultText: document.getElementById('match-result-text'),
    crossImage: document.getElementById('cross-image'),
    restartButton: document.getElementById('restart-button'),
    score: document.getElementById('score'),
    versusPlayerCardPower: document.getElementById('versus-player-card-power'),
    versusEnemyCardPower: document.getElementById('versus-enemy-card-power'),
    cardDetail: {
        cardTitle: document.getElementById('detail-card-title'),
        cardSubTitle: document.getElementById('detail-card-subtitle'),
        cardImage: document.getElementById('card-selected'),
        cardPower: document.getElementById('detail-card-power'),
        cardDescription: document.getElementById('detail-card-description'),
        cardNotSelected: document.getElementById('card-not-selected')
    },
    cardPowerMultiplier: 500
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

function calculateMath(player, enemy) {
    const playerChamp = JSON.parse(player.dataset.champion);
    const enemyChamp = JSON.parse(enemy.dataset.champion);

    const playerPower = (Number(playerChamp.info.difficulty) * state.cardPowerMultiplier);
    const enemyPower = (Number(enemyChamp.info.difficulty) * state.cardPowerMultiplier);

    state.versusPlayerCardPower.innerHTML = playerPower;
    state.versusEnemyCardPower.innerHTML = enemyPower;

    state.matchResult.classList.remove('hidden');
    state.crossImage.classList.add('hidden');

    state.round++;

    if (playerPower > enemyPower) {
        state.matchResultText.innerHTML = "Player Won";
        state.wins++;
    } else if (playerPower < enemyPower) {
        state.matchResultText.innerHTML = "Player Lose";
        state.loses++;
    } else {
        state.matchResultText.innerHTML = "Draw";
        state.draws++;
    }

    state.score.innerHTML = `${state.wins}/${state.draws}/${state.loses}`;

    if (state.round == 5) {
        if (state.wins >= 3) {
            state.matchResultText.innerHTML = "Player Won the Match!";
        } else {
            state.matchResultText.innerHTML = "Player Lose the Match!";
        }
        state.restartButton.classList.remove('hidden');
    }
}

function selectCard(event) {
    const playerCard = event.target;

    // Atualizar carta no versus para o jogador
    state.playerVersus.src = playerCard.src;

    // Atualizar carta no versus para o inimigo
    const enemyCard = getRandomEnemyCard();
    state.enemyVersus.src = enemyCard.src;

    // Calculate Match
    calculateMath(playerCard, enemyCard);

    // Deletar carta do jogador
    playerCard.remove();

    // Deletar carta do inimigo
    enemyCard.remove();
}

async function updateDetailSection(event) {
    const champion = JSON.parse(event.target.dataset.champion);

    state.cardDetail.cardNotSelected.classList.add('hidden');
    state.cardDetail.cardTitle.innerHTML = champion.name;
    state.cardDetail.cardSubTitle.innerHTML = champion.title;
    state.cardDetail.cardPower.innerHTML = (Number(champion.info.difficulty) * state.cardPowerMultiplier);
    state.cardDetail.cardDescription.innerHTML = champion.blurb;
    state.cardDetail.cardImage.style.backgroundImage = `url('${champImageURL(champion.id)}')`;
    state.cardDetail.cardImage.classList.remove('hidden');
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