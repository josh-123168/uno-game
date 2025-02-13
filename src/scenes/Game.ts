import { Scene } from 'phaser';

export class Game extends Scene
{
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    stars: any;
    score: any;
    scoreText: any;

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create ()
    {
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.add.image(400, 300, 'sky')

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (star:any) {
            star.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
            return null;
        });

        this.physics.add.collider(this.stars.getChildren(), this.platforms);
        this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

        this.score = 0;

        function collectStar (player:any, star:any)
        {
            star.disableBody(true, true);
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score)
        }

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '$000' });

    }

    update ()
    {
        if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-160);
            
                this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(160);
            
                this.player.anims.play('right', true);
            }
            else
            {
                this.player.setVelocityX(0);
            
                this.player.anims.play('turn');
            }
            
            if (this.cursors.up.isDown && this.player.body.touching.down)
            {
                this.player.setVelocityY(-330);
            }
    }
}
