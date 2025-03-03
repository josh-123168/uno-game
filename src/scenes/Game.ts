import { Scene } from 'phaser';

let message;
let messageBackground;

function createDeck() {
    const colors = ['red','green','yellow','blue','wild'];
    const values = ['0','1','2','3','4','5','6','7','8','9','Draw','Reverse','Skip','Wild_Draw','Wild'];
    let deck = [];
    colors.forEach(color=>{
        values.forEach(value=>{
            deck.push({colo:color,value:value});
        });
    });
    Phaser.Utils.Array.Shuffle(deck);
    return deck;
}

function dealCards(deck,scene) {
    const cardWidth = 85;
    const cardHeight = 128;
    const playPileStart = {x:95,y:300};
    const cardSpacing = 5;
    const pileSpacing = 64;

    const positions = calculatePositions(playPileStart,cardWidth,cardSpacing);

    let allCards = [];
    let playedCards = [];

    let drawPile = scene.add.image(400,500,"card_back");
    drawPile.displayWidth = cardWidth;
    drawPile.displayHeight = cardHeight;
    drawPile.setData("type","drawPile");
    drawPile.setInteractive({cursor: "pointer"});
    let playPile = scene.add.image(600,500,"red_3");
    playPile.displayWidth = cardWidth;
    playPile.displayHeight = cardHeight;
    playPile.setData("type","playPile")

    for(let i=0; i<15; i++) {
        let card = deck.pop();
        let cardSprite = createCardSprite(scene,card,positions[i],i<18);
        allCards.push(cardSprite);

        handleCardInteraction(scene,cardSprite,playPile,allCards,playedCards);
    }
    scene.drawPileCards = [];
    for(let i=0; i<deck.length;i++) {
        let card = deck[i];
        let cardSprite = createCardSprite(scene,card,{x:drawPile,y:drawPile.y}, true, true);
        scene.drawPileCards.push(cardSprite);
    }
    handleDrawPileClick(scene,drawPile,playPile,allCards,playedCards);
}

function calculatePositions(playPileStart,cardWidth,cardSpacing,pileSpacing) {
    return [
        {x:playPileStart.x+1.5*(cardWidth+cardSpacing),y:playPileStart.y-3*pileSpacing}
    ]
}

function createCardSprite(scene,card,position,isFaceDown,isFromDrawPile = false) {
    let cardSprite = scene.add.image(position.x,position.y,isFaceDown?"card_back":`${card.color}-${card.value}`);
    cardSprite.setData("card",card);
    if(!isFromDrawPile)
        cardSprite.setInteractive({cursor:'pointer'});
    cardSprite.displayWidth = 85;
    cardSprite.displayHeight = 128;
    return cardSprite;
}

export class Game extends Scene {

    constructor() {
        super('Game');
    }

    preload() {
        const colors = ['red','green','yellow','blue','wild'];
        const values = ['0','1','2','3','4','5','6','7','8','9','Draw','Reverse','Skip','Wild_Draw','Wild'];

        colors.forEach(color=>{
            values.forEach(value=>{
                this.load.image(`${color}_${value}`,`assets/${color}/${color}_${value}.png`)
            });
        });
        this.load.image('card_back','assets/Deck.png');
        this.load.image('background','assets/Table_1.png');
    }

    create() {
        let background = this.add.image(0,0,'background');
        background.setOrigin(0,0);
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;

        let cardDeck = createDeck();
        dealCards(cardDeck,this);
        message = this.add.text(config.width/2,config.height/2, 'Hello Player',
        {fontSize:'50px',fill:'#f5f5f5',fontStyle:'bold',align:'center'});
        message.setOrigin(0.5);
        message.setAlpha(0);

        messageBackground = this.add.graphics();
        messageBackground.fillStyle(0xbf0a3a,1);
        messageBackground.setVisible(false);

        messageBackground.fillRoundedRect(config.width/2 - message.width/2 -10,
        config.height/2 - message.height/2-10,message.width+20,message.height+20,5);

        this.children.bringToTop(message);
    }

    update() {
    }
}
