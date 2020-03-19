var game = new Phaser.Game(704, 704, Phaser.CANVAS, "game", false, false, false);

var map;
var layer;
var midTile = 32;
var help;
var player;

var leftButton;
var rightButton;
var upButton;
var downButton;

var startX;
var startY;
var endX;
var endY;

var nextTile = 0;

var rndUp = 0;
var rndLeft = 0;
var rndRight = 0;
var rndDown = 0;

var rndObjX = 0;
var rndObjY = 0;

var timer = 0;

var game_state = {
    
    init: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;
        this.game.time.advancedTiming = true;
        this.game.canvas.id = 'myCanvas';
    },
    
    
	preload: function () {
        this.game.load.tilemap('map', 'map.csv', null, Phaser.Tilemap.CSV);
        this.game.load.image('tiles', 'wall.png');
        //this.game.load.spritesheet('doors', 'wall.png', 64, 64);
        this.game.load.spritesheet('player', 'spaceman.png', 16, 16);
    },
    
    
    create: function () {
        //map
        map = game.add.tilemap('map', 64, 64);
        map.addTilesetImage('tiles');
        layer = map.createLayer(0);
        this.game.world.setBounds(map.x, map.y, map.widthInPixels, map.heightInPixels);
        map.setCollisionByExclusion([1, 4, 5, 6, 7]);
        layer.resizeWorld();
        
        
        if (rndUp < 2 && rndDown < 2 && rndLeft < 2 && rndRight < 2) {
            rndUp = this.game.rnd.integerInRange(0, 8);
            rndLeft = this.game.rnd.integerInRange(0, 8);
            rndRight = this.game.rnd.integerInRange(0, 8);
            rndDown = this.game.rnd.integerInRange(0, 8);
        }
        
        switch (rndUp) {
            case 0:
                map.putTile(18, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                break;
            case 1:
                map.putTile(15, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                break;
            default:
                map.putTile(4, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                break;
        }
        
        switch (rndLeft) {
            case 0:
                map.putTile(16, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                break;
            case 1:
                map.putTile(15, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                break;
            default:
                map.putTile(5, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                break;
        }
        
        switch (rndRight) {
            case 0:
                map.putTile(16, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                break;
            case 1:
                map.putTile(13, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                break;
            default:
                map.putTile(6, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                break;
        }
        
        switch (rndDown) {
            case 0:
                map.putTile(18, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                break;
            case 1:
                map.putTile(14, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                break;
            default:
                map.putTile(7, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                break;
        }
        
        
        rndObjX = this.game.rnd.integerInRange(3, 7);
        rndObjY = this.game.rnd.integerInRange(3, 7);
        map.putTile(2, layer.getTileX(layer.x + map.tileWidth * rndObjX), layer.getTileY(layer.y + map.tileWidth * rndObjY));
        
        
        
        //  Player
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
        player.body.setSize(10, 10, 2.5, 2.5);
        player.body.collideWorldBounds = true;
        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
        
        
        leftButton = this.game.input.keyboard.addKey(37);//left
        leftButton.onDown.add(this.ileft, this);
        upButton = this.game.input.keyboard.addKey(38);//up
        upButton.onDown.add(this.iup, this);
        rightButton = this.game.input.keyboard.addKey(39);//right
        rightButton.onDown.add(this.iright, this);
        downButton = this.game.input.keyboard.addKey(40);//down
        downButton.onDown.add(this.idown, this);
        
        
        this.game.input.onDown.add(function (cursor) {
            startX = this.game.input.worldX;
            startY = this.game.input.worldY;
        }, this);
        
        this.game.input.onUp.add(function (cursor) {
            endX = this.game.input.worldX;
            endY = this.game.input.worldY;
            
            var distX = startX - endX;
            var distY = startY - endY;
                        
            if(Math.abs(distX) > Math.abs(distY) *2 && Math.abs(distX) > 10){
                if(distX > 0){
                        this.ileft();
                   }
                   else{
                       this.iright();
                   }
            }
            if(Math.abs(distY) > Math.abs(distX) *2 && Math.abs(distY) > 10){
                if(distY > 0){
                        this.iup();
                   }
                   else{
                        this.idown();
                   }
            }
        }, this);
    },
    
    ileft: function() {
        
        nextTile = map.getTile(layer.getTileX(player.x - map.tileWidth), layer.getTileY(player.y)).index;
        
        if (nextTile === 1 || nextTile >= 4 && nextTile <= 7) {
            player.x = player.x - map.tileWidth;
            player.play('left');
            player.animations.stop();
        }       
        
    },
    
    iup: function() {
        
        nextTile = map.getTile(layer.getTileX(player.x), layer.getTileY(player.y - map.tileHeight)).index;
        
        if (nextTile === 1 || nextTile >= 4 && nextTile <= 7) {
            player.y = player.y - map.tileHeight;
            player.play('up');
            player.animations.stop();
        }

    },
    
    iright: function() {
        
        nextTile = map.getTile(layer.getTileX(player.x + map.tileWidth), layer.getTileY(player.y)).index;
        
        if (nextTile === 1 || nextTile >= 4 && nextTile <= 7) {
            player.x = player.x + map.tileWidth;
            player.play('right');
            player.animations.stop();
        }
    },
    
    idown: function() {
        
        nextTile = map.getTile(layer.getTileX(player.x), layer.getTileY(player.y + map.tileHeight)).index;
        
        if (nextTile === 1 || nextTile >= 4 && nextTile <= 7) {
            player.y = player.y + map.tileHeight;
            player.play('down');
            player.animations.stop();
        }
    },

    
    update: function () {
        this.game.physics.arcade.collide(player, layer);
        
        timer ++;
        if (timer % 1000 === 0 && timer > 0) {
            
            //reposition player
            player.x = map.tileWidth * 5 + midTile;
            player.y = map.tileHeight * 5 + midTile;
            
            //clear doors
            switch (rndUp) {
                case 0:
                    map.putTile(18, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                    break;
                case 1:
                    map.putTile(15, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                    break;
                default:
                    map.putTile(8, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                    break;
            }

            switch (rndLeft) {
                case 0:
                    map.putTile(16, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                    break;
                case 1:
                    map.putTile(15, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                    break;
                default:
                    map.putTile(10, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                    break;
            }

            switch (rndRight) {
                case 0:
                    map.putTile(16, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                    break;
                case 1:
                    map.putTile(13, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                    break;
                default:
                    map.putTile(9, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                    break;
            }

            switch (rndDown) {
                case 0:
                    map.putTile(18, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                    break;
                case 1:
                    map.putTile(14, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                    break;
                default:
                    map.putTile(11, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                    break;
            }
            
            //clear obj
            map.putTile(1, layer.getTileX(layer.x + map.tileWidth * rndObjX), layer.getTileY(layer.y + map.tileWidth * rndObjY));
            
            //new select rnd
            rndUp = this.game.rnd.integerInRange(0, 8);
            rndLeft = this.game.rnd.integerInRange(0, 8);
            rndRight = this.game.rnd.integerInRange(0, 8);
            rndDown = this.game.rnd.integerInRange(0, 8);
            if (rndUp < 2 && rndDown < 2 && rndLeft < 2 && rndRight < 2) {
                rndUp = this.game.rnd.integerInRange(0, 8);
                rndLeft = this.game.rnd.integerInRange(0, 8);
                rndRight = this.game.rnd.integerInRange(0, 8);
                rndDown = this.game.rnd.integerInRange(0, 8);
            }
            
            //draw new door
            switch (rndUp) {
                case 0:
                    map.putTile(18, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                    break;
                case 1:
                    map.putTile(15, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                    break;
                default:
                    map.putTile(4, layer.getTileX(layer.x + map.tileWidth * rndUp), layer.getTileY(layer.y + map.tileWidth));
                    break;
            }

            switch (rndLeft) {
                case 0:
                    map.putTile(16, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                    break;
                case 1:
                    map.putTile(15, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                    break;
                default:
                    map.putTile(5, layer.getTileX(layer.x + map.tileWidth), layer.getTileY(layer.y + map.tileWidth * rndLeft));
                    break;
            }

            switch (rndRight) {
                case 0:
                    map.putTile(16, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                    break;
                case 1:
                    map.putTile(13, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                    break;
                default:
                    map.putTile(6, layer.getTileX(layer.width - map.tileWidth * 2), layer.getTileY(layer.y + map.tileWidth * rndRight));
                    break;
            }

            switch (rndDown) {
                case 0:
                    map.putTile(18, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                    break;
                case 1:
                    map.putTile(14, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                    break;
                default:
                    map.putTile(7, layer.getTileX(layer.x + map.tileWidth * rndDown), layer.getTileY(layer.height - map.tileWidth * 2));
                    break;
            }
            
            rndObjX = this.game.rnd.integerInRange(3, 7);
            rndObjY = this.game.rnd.integerInRange(3, 7);
            map.putTile(2, layer.getTileX(layer.x + map.tileWidth * rndObjX), layer.getTileY(layer.y + map.tileWidth * rndObjY));
        }
        
    },
    
    render: function () {
        this.game.debug.text("use setas ou arraste o jogador para a proxima casa", 50, 50, "#f0f");
    }
    
};
  
this.game.state.add('ingame', game_state);
this.game.state.start('ingame');