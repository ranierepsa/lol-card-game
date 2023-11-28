const allChampDataURL = 'https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json';
const champImageURL = (champion) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion}_0.jpg`;
let championsJson;

const state = {
    playerDeck: document.getElementsByClassName('player-deck')[0],
    enemyDeck: document.getElementsByClassName('enemy-deck')[0],
}

async function getChampionsData() {
    return (await fetch(new Request(allChampDataURL))).json();
}

function getRandomChampion() {
    const champArray = Object.values(championsJson.data);
    const randomIndex = Math.floor((Math.random() * champArray.length));
    return Object.values(championsJson.data)[randomIndex];
}

async function getChampionImageByName(name) {
    return fetch(new Request(champImageURL(name)))
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob));
}

async function drawCards(amount) {
    for (i = 0; i < amount; i++) {
        const cardImage = document.createElement('img');
        const champion = getRandomChampion();
        cardImage.src = await getChampionImageByName(champion.id);
        cardImage.classList.add('deck-card');
        state.playerDeck.appendChild(cardImage);
    }
}

async function startGame() {
    championsJson = await getChampionsData();
    drawCards(5);
}

startGame();


// USAR OS CAMPOS:
//  data.{championName}.name para o título da carta e identificação da imagem da carta
//  data.{championName}.title para o subtítulo da carta
//  data.{championName}.difficulty para calcular a força da carta
/*

{
    "type":"champion",
    "format":"standAloneComplex",
    "version":"13.23.1",
    "data":{
        "Aatrox":{
            "version":"13.23.1",
            "id":"Aatrox",
            "key":"266",
            "name":"Aatrox",
            "title":"the Darkin Blade",
            "blurb":"Once honored defenders of Shurima against the Void, Aatrox and his brethren would eventually become an even greater threat to Runeterra, and were defeated only by cunning mortal sorcery. But after centuries of imprisonment, Aatrox was the first to find...",
            "info":{
            "attack":8,
            "defense":4,
            "magic":3,
            "difficulty":4
            },
            "image":{
            "full":"Aatrox.png",
            "sprite":"champion0.png",
            "group":"champion",
            "x":0,
            "y":0,
            "w":48,
            "h":48
            },
            "tags":[
            "Fighter",
            "Tank"
            ],
            "partype":"Blood Well",
            "stats":{
            "hp":650,
            "hpperlevel":114,
            "mp":0,
            "mpperlevel":0,
            "movespeed":345,
            "armor":38,
            "armorperlevel":4.45,
            "spellblock":32,
            "spellblockperlevel":2.05,
            "attackrange":175,
            "hpregen":3,
            "hpregenperlevel":1,
            "mpregen":0,
            "mpregenperlevel":0,
            "crit":0,
            "critperlevel":0,
            "attackdamage":60,
            "attackdamageperlevel":5,
            "attackspeedperlevel":2.5,
            "attackspeed":0.651
            }
        }
    }
}

*/