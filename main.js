var w = window.innerWidth;
var h = window.innerHeight;
var r = window.devicePixelRatio;//w / h;
//var game = new Phaser.Game(Math.ceil(480 * r), 480, Phaser.CANVAS, "game", false, false, false);
var game = new Phaser.Game(((window.innerWidth * window.devicePixelRatio) / (window.innerHeight * window.devicePixelRatio)) * 480, 480, Phaser.CANVAS, "game", false, false, false);

var firstRunPortrait;
var cursors;
var ww = 0;
var wh = 0;
let wr = 0;
var scale = 3;
var tileSize = 16;

var player;


var game_state = {
    
    init: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.refresh(true);
        
        firstRunPortrait = game.scale.isGamePortrait;
        game.scale.forceOrientation(true, true);
        game.scale.enterIncorrectOrientation.add(this.handleIncorrect);
        game.scale.leaveIncorrectOrientation.add(this.handleCorrect);
        
        game.input.maxPointers = 1;
        game.stage.disableVisibilityChange = false;
        game.time.advancedTiming = true;
        game.canvas.id = 'myCanvas';
        
        ww = game.world.width;
        wh = game.world.height;
        wr = ww / wh;
        
        game.stage.backgroundColor = "#555555";
    },
    
    
    handleIncorrect: function(){
     	if(!this.game.device.desktop){
            //document.getElementById("rotate").style.display="block";
     	}
	},
	
	handleCorrect: function(){
		if(!this.game.device.desktop){
			if(firstRunPortrait){
                window.location.reload();
                game.state.start("ingame");
            }
            //document.getElementById("rotate").style.display="none";
		}
	},
    
	preload: function () {
        game.load.tilemap('map', 'maps.csv', null, Phaser.Tilemap.CSV);
        game.load.image('tiles', 'map.png');
        game.load.spritesheet('maps', 'map.png', 16, 16);
        game.load.spritesheet('player', 'player.png', 16, 16);
    },
    
    
    create: function () {
        
        
        //map
        map = game.add.tilemap('map', 16, 16);
        map.addTilesetImage('tiles');
        map.setCollisionByExclusion([0]);
        layer = map.createLayer(0, map.widthInPixels, map.heightInPixels);
        layer.setScale(scale);
        /*
        layer.fixedToCamera = false;
        layer.scrollFactorX = 0;
        layer.scrollFactorY = 0;
        this.mapOffsetX = (game.camera.width - map.widthInPixels) / 2;
        layer.position.set(this.mapOffsetX, 0);
        layer.anchor.set(0.5);
        //layer.debug = true;
        */
        layer.resizeWorld();
        
        
        player = this.game.add.sprite(layer.x + 150, layer.y + 200, 'player');//layer.x + layer.width / 2 - 100, layer.y + layer.height / 2, 'player');
        player.anchor.set(0.5);
        player.scale.set(0.5 * scale);
        player.animations.add('left', [8,9], 10, true);
        player.animations.add('right', [1,2], 10, true);
        player.animations.add('up', [11,12,13], 10, true);
        player.animations.add('down', [4,5,6], 10, true);
        player.animations.add('idle', [1], 10, true);
        player.play('idle');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        //player.body.setSize(10, 10, 2.5, 2.5);
        player.body.collideWorldBounds = true;
        this.game.camera.follow(player);//, Phaser.Camera.FOLLOW_LOCKON);
        
        
        
        //  Allow cursors to scroll around the map
        cursors = game.input.keyboard.createCursorKeys();
    },
    
    
    update: function () {  
        player.body.velocity.set(0);

        if (cursors.left.isDown) {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 200;
        }

        if (cursors.up.isDown) {
            player.body.velocity.y = -200;
        }
        else if (cursors.down.isDown) {
            player.body.velocity.y = 200;
        }
        
        this.game.physics.arcade.collide(player, layer);
        
    },
   
    render: function () {
        this.game.debug.text("lx: " + layer.x + " ly: " + layer.y + " lw: " + layer.width + " lh: " + layer.height, 50, this.game.height - 100, "#f0f");
        //this.game.debug.text("gw: " + w + " gh: " + h + " r: " + r, 50, this.game.height - 100, "#f0f");
        //this.game.debug.text("ww: " + ww + " wh: " + wh + " wr: " + wr, 50, this.game.height - 50, "#f0f");
    }
    
};
  
game.state.add('ingame', game_state);
game.state.start('ingame');