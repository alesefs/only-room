//var game = new Phaser.Game("110%", "110%", Phaser.CANVAS, "game", false, false, false);
/*
var game = new Phaser.Game(Math.ceil(640*gameRatio), 640, Phaser.CANVAS);
*/
//var gameRatio = window.innerWidth/window.innerHeight;
//var game = new Phaser.Game(Math.ceil(960*gameRatio), 960, Phaser.CANVAS, "game", false, false, false);
//var game = new Phaser.Game(704, 704, Phaser.CANVAS, "game", false, false, false);
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, "game", false, false, false);
var firstRunPortrait;

var map;
var layer;
var midTile = 32;
var help;
var player;
var player2;

var leftButton;
var rightButton;
var upButton;
var downButton;

var cursors;

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

var nextTile = 0;

var rndUp = 0;
var rndLeft = 0;
var rndRight = 0;
var rndDown = 0;

var rndObjX = 0;
var rndObjY = 0;

var timer = 0;
var obstacle;
var coins;
var isPass = false;


var base;
var manch;
var dist = 0;
var angle = 0;
var pointer;
var scaleRatio = window.devicePixelRatio / 3;


var game_state = {
    
    init: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        //this.game.scale.startFullScreen(true);
        
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        
        firstRunPortrait = this.game.scale.isGamePortrait;
        this.game.scale.forceOrientation(true, false);
        this.game.scale.enterIncorrectOrientation.add(this.handleIncorrect);
        this.game.scale.leaveIncorrectOrientation.add(this.handleCorrect);
        
        //  This sets a limit on the up-scale
        //this.game.scale.maxWidth = 1408;
        //this.game.scale.maxHeight = 1408;
        //this.game.scale.minWidth = 352;
        //this.game.scale.maxHeight = 352;


        this.input.maxPointers = 2;
        this.stage.disableVisibilityChange = false;
        this.game.time.advancedTiming = true;
        this.game.canvas.id = 'myCanvas';
    },
    
    
    handleIncorrect: function(){
     	if(!this.game.device.desktop){
            document.getElementById("rotate").style.display="block";
     	}
	},
	
	handleCorrect: function(){
		if(!this.game.device.desktop){
			
				//gameRatio = window.innerWidth/window.innerHeight;		
				//this.game.width = window.innerHeight + window.innerHeight * 0.1;
				//this.game.height = window.innerWidth + window.innerWidth * 0.5;//Math.ceil(640*gameRatio);
				
                //gameRatio = window.innerWidth/window.innerHeight;		
				//this.game.width = 640;
				//this.game.height = Math.ceil(640*gameRatio);
                
                //this.game.renderer.resize(this.game.width, this.game.height);
				///this.game.state.start("ingame");
            
			if(firstRunPortrait){
                window.location.reload();
                this.game.state.start("ingame");
            }
            document.getElementById("rotate").style.display="none";
		}
	},
    
	preload: function () {
        this.game.load.tilemap('map', 'map2.csv', null, Phaser.Tilemap.CSV);
        this.game.load.image('tiles', 'wall.png');
        this.game.load.spritesheet('player', 'spaceman.png', 16, 16);
        this.game.load.spritesheet('doors', 'wall.png', 64, 64);
        this.game.load.image('base', 'base.png');
		this.game.load.image('manch', 'manch.png');
    },
    
    
    create: function () {
        
        //this.game.camera.bounds(50, 50, 500, 500);
        
        //map
        map = game.add.tilemap('map', 64, 64);
        map.addTilesetImage('tiles');
        layer = map.createLayer(0);
        //layer.debug = true;
        this.game.world.setBounds(map.x, map.y, map.widthInPixels, map.heightInPixels);
        map.setCollisionByExclusion([0, 1, 4, 5, 6, 7]);
        //map.setTileIndexCallback(2, this.hitCoin, this);
        layer.resizeWorld();
      
        
        //  Player
        //player = this.game.add.sprite(map.tileWidth * 14 + midTile, map.tileHeight * 15 + midTile, 'player');
        player = this.game.add.sprite(map.tileWidth * 5 + midTile, map.tileHeight * 5 + midTile, 'player');
        player.anchor.set(0.5);
        player.scale.set(2.5);
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
        
        
        
        
        cursors = this.game.input.keyboard.createCursorKeys();
        
        pointer = new Phaser.Point(this.game.camera.x + 150, this.game.camera.height - 150);
        pointer.fixedToCamera = true;
        
        base = this.game.add.sprite(pointer.x, pointer.y, 'base');
        base.scale.set(2);
        base.anchor.setTo(0.5,0.5);
        base.fixedToCamera = true;
        base.circ = base.width / 2;
        //input
        base.inputEnabled = true;
        base.input.pixelPerfectOver = true;
        
        manch = this.game.add.sprite(pointer.x, pointer.y, 'manch');
        manch.scale.set(2);
        manch.anchor.setTo(0.5,0.5);
        manch.circ = manch.width / 2;

        
        //this.game.camera.width = this.game.width / 2;
        //this.game.camera.height = this.game.height / 2;
        
    },
    
    
    update: function () {  
        
        /*
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
        */
        
        
        base.events.onInputDown.add( function (pointer) {
            isPass = true   
        }, this);
        
        base.events.onInputUp.add( function (pointer) {
            isPass = false;
        }, this);
        
            startX = this.game.input.worldX;
            startY = this.game.input.worldY;
            
            dist = Math.round(Math.sqrt(Math.pow(startX - base.x, 2) + Math.pow(startY - base.y, 2)));
            angle = Math.atan2(startY - base.y, startX - base.x);
            
            if (/*game.input.activePointer.isDown || */isPass) {

                if (dist > base.circ) {

                    manch.x = base.x + manch.circ * Math.cos(angle);
                    manch.y = base.y + manch.circ * Math.sin(angle);
                    
                    
                } else {
                    manch.x = startX;
                    manch.y = startY;
                    
                }

            } else {
                player.body.velocity.set(0);
                manch.alignIn(base, Phaser.CENTER);
            }
            


        var maxSpeed = 200;
        if (manch.x !== base.x || manch.y !== base.y) {
            this.game.physics.arcade.velocityFromRotation(angle, maxSpeed, player.body.velocity);//dist * maxSpeed
            player.rotation = angle;
            
            if (player.angle < -45 && player.angle > -135) {
                player.play('up');
                player.angle = 0;
                
            } else if (player.angle > 45 && player.angle < 135) {
                player.play('down');
                player.angle = 0;
            
            } else if (player.angle > 135 || player.angle < -135) {
                player.play('left');
                player.angle = 0;
                
            } else if (player.angle < 45 || player.angle > -45) {
                player.play('right');
                player.angle = 0;
                
            } else {
                player.play('idle');
            }
            
        } else { //parado
            player.body.velocity.set(0);
            player.animations.stop(null, true);
        } 
        
        
       
        //colide map
        this.game.physics.arcade.collide(player, layer);
    },
       
   
    
   
    render: function () {
        //this.game.debug.body(player);
        //this.game.debug.body(base);
        //this.game.debug.body(manch);
        
        //this.game.debug.text("timer: " + layer.getTileX(player.x) + " nexttile: " + nextTile + " up: " + rndUp + " left: " + rndLeft + " right: " + rndRight + " down: " + rndDown, 50, 50, "#f0f");
        //this.game.debug.text("pointx: " + startX + " -- pointy: " + startY, 50, 50, "#f0f");
        //this.game.debug.text("pointx: " + pointer.x + " -- pointy: " + pointer.y, 50, 75, "#f0f");
        //this.game.debug.text("distBT: " + dist + " -- angleBT: " + angle + " -- rotate: " + player.angle, 50, 100, "#f0f");
        //this.game.debug.text("gw: " + this.game.width + " gww: " + this.game.world.width, 50, 100, "#f0f");
    }
    
};
  
this.game.state.add('ingame', game_state);
this.game.state.start('ingame');