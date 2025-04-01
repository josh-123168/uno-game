import { Scene } from 'phaser';

const WIDTH = 1000;
const HEIGHT = 700;
const PLAYER_1 = 0;
const PLAYER_2 = 1;

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
        this.load.image('empty', 'assets/Empty.png')
    }

    create() {
        let message: Phaser.GameObjects.GameObject;
        let messageBackground: Phaser.GameObjects.Graphics;

        let background = this.add.image(0,0,'background');
        background.setOrigin(0,0);
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;

        let cardDeck = createDeck();
        dealCards(cardDeck,this);
        message = this.add.text(WIDTH/2,HEIGHT/2, 'Hello Player',
        {fontSize:'50px',color:'#f5f5f5',fontStyle:'bold',align:'center'});
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

        function dealCards(deck,scene) {
            const cardWidth = 85;
            const cardHeight = 128;
            const cardSpacing = 5;
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
            let playPile = scene.add.image(600,350,"empty");
            playPile.displayWidth = cardWidth;
            playPile.displayHeight = cardHeight;
            playPile.setData("type","playPile")

            //all hands loop
            for(let i=0; i<14; i++) {
                let card = deck.pop();
                let cardSprite = createCardSprite(scene,card,positions[i],i<7,false);
                allCards.push(cardSprite);

                handleCardInteraction(scene,cardSprite,playPile,allCards,playedCards, i < 7 ? PLAYER_1 : PLAYER_2);
            }

            scene.drawPileCards = [];

            //draw pile loop
            for(let i=0; i<deck.length; i++) {
                let card = deck[i];
                let cardSprite = createCardSprite(scene,card,{x:drawPile,y:drawPile.y},true,true);
                scene.drawPileCards.push(cardSprite);
            }
            handleDrawPileClick(scene,drawPile,playPile,allCards,playedCards);
        }

        // function pickFirstCard(firstCard) {
        //     if (firstCard.color == "") {
        //         return "Red_1";
        //     } else {
        //         return `${firstCard.color}_${firstCard.value}`;
        //     }
        // }

        function calculatePositions(yourPileStart,cardWidth,cardSpacing,pileSpacing,oppPileStart) {
            return [
                //opp hand
                {x:yourPileStart.x+1.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+2.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+3.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+4.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+5.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+6.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                {x:yourPileStart.x+7.5*(cardWidth+cardSpacing),y:oppPileStart.y-pileSpacing},
                
                //player hand
                {x:yourPileStart.x+1.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+2.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+3.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+4.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+5.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+6.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
                {x:yourPileStart.x+7.5*(cardWidth+cardSpacing),y:yourPileStart.y-pileSpacing},
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


        function handleCardInteraction(scene,cardSprite,playPile,allCards,playedCards,player)
        {
            cardSprite.on("pointerdown",function(pointer){
                if (turnState !== player) return;
                let topCardData = playPile.getData("topCard");
                if(topCardData == undefined)
                    return;
                let cardData = cardSprite.getData("card");
                let key = `${cardData.color}_${cardData.value}`;
                if(isValueMatch(topCardData,cardData) || isColorMatch(topCardData,cardData) && isCardFree(cardSprite,allCards)) {
                    scene.tweens.add({
                        targets: cardSprite,
                        x: playPile.x,
                        y: playPile.y,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: function() {
                            cardSprite.setTexture(key);
                            playPile.setData("topCard",cardData);
                            scene.children.bringToTop(cardSprite);
                            cardSprite.disableInteractive();
                            checkAndFlipFreeCards(allCards);
                            playedCards.push(cardSprite);
                            checkForEndGame(scene.drawPileCards,playedCards,allCards,cardData);
                        }
                        
                    });
                    if(specialCardPlayed(cardData)) {
                        return;
                    } else {
                        changeTurn();
                    }
                }                
            });
        }

        //detects if a special card is played and makes corresponding changes
        function specialCardPlayed(cardData) {
            if(cardData.value === "Reverse" || cardData.value === "Skip" || cardData.value === "Draw" || cardData.value === "Wild_Draw") {
                return true;
            } else {
                return false;
            }
        }
        

        function isCardFree(card,allCards) {
            // const cardX = card.x;
            // const cardY = card.y;
            // const cardWidth = card.displayWidth;

            // for(let i=0; i<allCards.length; i++) {
            //     let otherCard = allCards[i];
            //     if(otherCard === card) continue;
            //     if (
            //         otherCard.y === cardY+64 &&
            //         otherCard.x >= cardX - (cardWidth) &&
            //         otherCard.x <= cardX + (cardWidth)
            //     ) {
            //         return false;
            //     }
            // }
            return true;
        }

        //checks for matching values between cards
        function isValueMatch(card1,card2) {
            const values1 = getCardValue(card1);
            const values2 = getCardValue(card2);
            return values1.some(val1=>values2.some(val2=>Math.abs(val1-val2)===0));
        }

        //checks for matching colors between cards or a wild
        function isColorMatch(card1,card2) {
            if(card1.color === "" || card2.color === "") {
                return true;
            }
            return card1.color===card2.color;
        }

        function getCardValue(card) {
            const valueMap = {
                '0':0,
                '1':1,
                '2':2,
                '3':3,
                '4':4,
                '5':5,
                '6':6,
                '7':7,
                '8':8,
                '9':9,
                'Draw':10,
                'Reverse':11,
                'Skip':12,
                'Wild_Wild':13,
                'Wild_Draw':14,
            }
            return [valueMap[card.value]];
        }

        function checkAndFlipFreeCards(allCards) {
            for(let i=0; i<allCards.length; i++) {
                let key = allCards[i].data.list.card.color+"_"+allCards[i].data.list.card.value;
                if(isCardFree(allCards[i],allCards))
                    allCards[i].setTexture(key);
            }
        }

        function handleDrawPileClick(scene,drawPile,playPile,allCards,playedCards) {
            drawPile.on("pointerdown",function(pointer){
                if(scene.drawPileCards.length === 0)
                    return;
                changeTurn();
                let topCard = scene.drawPileCards.pop();
                let cardData = topCard.getData("card");
                let key = `${cardData.color}_${cardData.value}`;

                let cardSprite = scene.add.image(drawPile.x,drawPile.y,"card_back");
                cardSprite.displayWidth = topCard.displayWidth;
                cardSprite.displayHeight = topCard.displayHeight;
                cardSprite.setData("card",cardData);

                scene.tweens.add({
                    targets:cardSprite,
                    x:playPile.x,
                    y:playPile.y,
                    duration:500,
                    ease: "Power2",
                    onComplete: function() {
                        cardSprite.setTexture(key);
                        scene.children.bringToTop(cardSprite);
                        if(scene.drawPileCards.length === 0) {
                            scene.add.image(drawPile.x,drawPile.y,"empty");
                        }
                        playPile.setData("topCard",cardData);
                        checkForEndGame(scene.drawPileCards,playedCards,allCards,topCard.data.list.card);
                    }
                });
            });
        }

        function checkForEndGame(drawPileCards,playedCards,allCards,topCard) {
            if(drawPileCards.length === 0 && !isThereAnyLegalMove(allCards,topCard,playedCards)) {
                displayEndMessage("You Lost!");
            }
            if(playedCards.length === 28) {
                displayEndMessage("You Won!",0x048738);
            }
        }

        function displayEndMessage(messageText: string,bgColor=0xbf0a3a) {
            messageBackground.clear();
            messageBackground.fillStyle(bgColor,1);
            const padding = 10;
            messageBackground.fillRoundedRect(
                WIDTH/2-message.width/2-padding,
                HEIGHT/2-message.height/2-padding,
                message.width+2*padding,
                message.height+2*padding,
                5
            );
            messageBackground.setVisible(true);
            message.setText(messageText);
            message.setAlpha(1);
        }

        function isThereAnyLegalMove(allCards,topCard,playedCards) {
            allCards = allCards.filter((item: any)=>!playedCards.includes(item));
            for(let i=0; i<allCards.length; i++) {
                if(isCardFree(allCards[i],allCards) && isValueMatch (allCards[i].data.list.card,topCard)) {
                    return true;
                }
            }
            return false;
        }

        //changes whose turn it is
        let turnState = PLAYER_1;

        function changeTurn() {
            if (turnState === PLAYER_1) {
                turnState = PLAYER_2;
            } else {
                turnState = PLAYER_1;
            }
        }

        //searches for an empty hand to call a win
        function detectGameWin() {

        }

        //ends game in a tie if the deck is empty
        function detectEmptyDeck() {

        }
    }

    update() {
    }
}