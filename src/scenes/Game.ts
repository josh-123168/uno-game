import { Scene } from 'phaser';

const WIDTH = 1000;
const HEIGHT = 700;

export class Game extends Scene {

    constructor() {
        super('Game');
    }

    preload() {
        const colors = ['Red','Green','Yellow','Blue'];
        const values = ['0','1','2','3','4','5','6','7','8','9','Draw','Reverse','Skip'];
        const wilds = ['Wild_Wild','Wild_Draw']

        colors.forEach(color=>{
            values.forEach(value=>{
                this.load.image(`${color}_${value}`,`assets/${color}_${value}.png`)
            });
        });
        wilds.forEach(wild=>{
            this.load.image(`_${wild}`,`assets/_${wild}.png`)
        })
        this.load.image('card_back','assets/Deck.png');
        this.load.image('background','assets/Table_1.png');
    }

    create() {
        let message;
        let messageBackground;

        let background = this.add.image(0,0,'background');
        background.setOrigin(0,0);
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;

        let cardDeck = createDeck();
        dealCards(cardDeck,this);
        message = this.add.text(WIDTH/2,HEIGHT/2, 'Hello Player',
        {fontSize:'50px',fill:'#f5f5f5',fontStyle:'bold',align:'center'});
        message.setOrigin(0.5);
        message.setAlpha(0);

        messageBackground = this.add.graphics();
        messageBackground.fillStyle(0xbf0a3a,1);
        messageBackground.setVisible(false);

        messageBackground.fillRoundedRect(WIDTH/2 - message.width/2 -10,
        HEIGHT/2 - message.height/2-10,message.width+20,message.height+20,5);

        this.children.bringToTop(message);

        function createDeck() {
            const colors = ['Red','Green','Yellow','Blue'];
            const values = {
                '0': 1,
                '1': 2,
                '2': 2,
                '3': 2,
                '4': 2,
                '5': 2,
                '6': 2,
                '7': 2,
                '8': 2,
                '9': 2,
                'Draw': 2,
                'Reverse': 2,
                'Skip': 2,
            };
            const wilds = {'Wild_Wild': 4, 'Wild_Draw': 4};
            let deck: {color: string, value: string}[] = [];
            colors.forEach(color=>{
                Object.entries(values).forEach(([value, num])=>{
                    for (let i = 0; i < num; i++){
                    deck.push({color:color,value:value});
                    }
                });
            });
            Object.entries(wilds).forEach(([key, value])=>{
                for (let i = 0; i < value; i++){
                deck.push({color:"",value:key});
                }
            });
            Phaser.Utils.Array.Shuffle(deck);
            return deck;
        }

        function pickFirstCard(firstCard) {
            if (firstCard.color == "") {
                return "Red_1";
            } else {
                return `${firstCard.color}_${firstCard.value}`;
            }
        }

        function dealCards(deck,scene) {
            const cardWidth = 85;
            const cardHeight = 128;
            // const yourPileStart = {x:95,y:300};
            const cardSpacing = 5;
            // const pileSpacing = 64;
            const yourPileStart = {x:95,y:650};
            const pileSpacing = 64;
            const oppPileStart = {x:95,y:175};

            const positions = calculatePositions(yourPileStart,cardWidth,cardSpacing,pileSpacing,oppPileStart);

            let allCards = [];
            let playedCards = [];

            let drawPile = scene.add.image(400,350,"card_back");
            drawPile.displayWidth = cardWidth;
            drawPile.displayHeight = cardHeight;
            drawPile.setData("type","drawPile");
            drawPile.setInteractive({cursor: "pointer"});

            let firstCard = deck[0];
            let playPile = scene.add.image(600,350,pickFirstCard(firstCard));
            playPile.displayWidth = cardWidth;
            playPile.displayHeight = cardHeight;
            playPile.setData("type","playPile")

            //all player piles loop
            for(let i=0; i<14; i++) {
                let card = deck.pop();
                let cardSprite = createCardSprite(scene,card,positions[i],i<7);
                allCards.push(cardSprite);

                // handleCardInteraction(scene,cardSprite,playPile,allCards,playedCards);
            }

            scene.drawPileCards = [];

            //draw pile loop
            for(let i=0; i<deck.length; i++) {
                let card = deck[i];
                let cardSprite = createCardSprite(scene,card,{x:drawPile,y:drawPile.y},true,true);
                scene.drawPileCards.push(cardSprite);
            }
            // handleDrawPileClick(scene,drawPile,playPile,allCards,playedCards);
        }

        function calculatePositions(yourPileStart,cardWidth,cardSpacing,pileSpacing,oppPileStart) {
            return [
                {x:yourPileStart.x+1.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+2.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+3.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+4.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+5.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+6.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+7.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},

                {x:yourPileStart.x+1.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+2.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+3.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+4.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+5.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+6.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+7.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+1.5*(cardWidth+cardSpacing),y:yourPileStart.y-3*pileSpacing},
                // {x:yourPileStart.x+4.5*(cardWidth+cardSpacing),y:yourPileStart.y-3*pileSpacing},
                // {x:yourPileStart.x+7.5*(cardWidth+cardSpacing),y:yourPileStart.y-3*pileSpacing},
            
                // {x:yourPileStart.x+(cardWidth+cardSpacing),y:yourPileStart.y-2*pileSpacing},
                // {x:yourPileStart.x+2*(cardWidth+cardSpacing),y:yourPileStart.y-2*pileSpacing},
                // {x:yourPileStart.x+4*(cardWidth+cardSpacing),y:yourPileStart.y-2*pileSpacing},
                // {x:yourPileStart.x+5*(cardWidth+cardSpacing),y:yourPileStart.y-2*pileSpacing},
                // {x:yourPileStart.x+7*(cardWidth+cardSpacing),y:yourPileStart.y-2*pileSpacing},
                // {x:yourPileStart.x+8*(cardWidth+cardSpacing),y:yourPileStart.y-2*pileSpacing},

                // {x:yourPileStart.x+0.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+1.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+2.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+3.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+4.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+5.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+6.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+7.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                // {x:yourPileStart.x+8.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},

                // {x:yourPileStart.x,y:yourPileStart.y},
                // {x:yourPileStart.x+(cardWidth+cardSpacing),y:yourPileStart.y},
                // {x:yourPileStart.x+2*(cardWidth+cardSpacing),y:yourPileStart.y},
                // {x:yourPileStart.x+3*(cardWidth+cardSpacing),y:yourPileStart.y},
                // {x:yourPileStart.x+4*(cardWidth+cardSpacing),y:yourPileStart.y},
                // {x:yourPileStart.x+5*(cardWidth+cardSpacing),y:yourPileStart.y},
                // {x:yourPileStart.x+6*(cardWidth+cardSpacing),y:yourPileStart.y},
                // {x:yourPileStart.x+7*(cardWidth+cardSpacing),y:yourPileStart.y},
                // {x:yourPileStart.x+8*(cardWidth+cardSpacing),y:yourPileStart.y},
                // {x:yourPileStart.x+9*(cardWidth+cardSpacing),y:yourPileStart.y},
            ];
        }

        function createCardSprite(scene,card,position,isFaceDown,isFromDrawPile = false) {
            let cardSprite = scene.add.image(position.x,position.y,isFaceDown?"card_back":`${card.color}_${card.value}`);
            cardSprite.setData("card",card);
            if(!isFromDrawPile)
                cardSprite.setInteractive({cursor:'pointer'});
            cardSprite.displayWidth = 85;
            cardSprite.displayHeight = 128;
            return cardSprite;
        }
    }

    update() {
    }
}