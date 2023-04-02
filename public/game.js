
import {updateData } from "./utilsAPI.js";
import {updateScore} from "./gestionScore.js";
let base = 150;
let distance_balle;
let background = null;
let player = null;
let cursors = null;
let fireball = null;
let gameOver = null;
let score_text =null;
let start_button = null;
let nbr_balle = 5; 
let jeuFini = false;
let scores = 0;
let gravite = 50; // a augmenté pour que les balles descente plus vite
let width_screen = document.documentElement.clientWidth*0.7;
let height_screen = document.documentElement.clientHeight*0.92;
let coin =null;
var music =null;
var death_music =null;

var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Game ()
    {
        Phaser.Scene.call(this, { key: 'game' });
        window.GAME = this;
    
    },
 preload :function preload ()
{
    this.load.image('background_jeu','./images/fond_jeu.jpg');
    this.load.spritesheet('perso','./images/guerrier.png',{frameWidth: 64, frameHeight: 64 });
    this.load.image('fireball','./images/fireball.png');
    this.load.image('coin', '../images/coins.png');
    this.load.audio('bg_audio',[ '../sounds/Take_Control.ogg' ,'../sounds/Take_Control.mp3']);
    this.load.audio('death',[ '../sounds/death_sound.ogg' ,'../sounds/death_sound.mp3']);
},

create :function create ()
{
    jeuFini = false;
     music = this.sound.add('bg_audio');
    death_music =  this.sound.add('death');
     
    music.play();
    this.background =this.add.image( width_screen, height_screen,'background_jeu');
    this.background.setOrigin(1);
    this.player = this.physics.add.sprite(width_screen/2,height_screen/2,'perso');
    this.player.setSize(30, 45);
    this.player.setOffset(18.5, 17);
    this.player.setScale(1.6);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
   
    //initialisation du score
    this.score_text  = this.add.text(5,0,'Score :0',{fontFamily: 'impact',fontSize : '50px',fill : '#fff',color :'#ffffff '});
    //initialisation coins 
    this.coin = this.physics.add.sprite(Phaser.Math.Between(0,width_screen),Phaser.Math.Between(0,height_screen), 'coin');
    //this.coin.setSize(1, 1);
    //this.coin.setOffset(18.5, 17);
    this.coin.setScale(0.04);
    this.coin.body.setAllowGravity(false);
    this.coin.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.coin,this.collectCoins,null,this);
    // creation d'un groupe de obstacles
    fireball  = this.physics.add.group({
        key: 'fireball',
        repeat: 6,// a augmenté en fonction de la difficulté 
       // setXY: { stepX:300 },
        setScale: { x: 0.1, y: 0.1},
        setSize : {x:0.1,y: 0.1 },
        setOffset :{x: 2,y: -3},
       
    });
    let changeGravity = false;
     //move the fireBall  and all it children
   fireball.children.iterate(function (child) {
     distance_balle = 150;// a augmenté en fonction de la difficulté 
    child.setSize(350,350);
    child.setOffset(49,55);
    let r =Phaser.Math.Between(0,width_screen) ;
    child.setBounceX(r);
    child.setBounceY(Phaser.Math.Between(5,100));
    child.setX(r);
    if(!changeGravity){
        child.setY(height_screen);
        changeGravity = true;
      child.setGravityY(-75);
    }else{
        child.setY(-height_screen);
        changeGravity = false;
        child.setGravityY(75);
    }
    
console.log("  rfdfdf  "+distance_balle);
   // child.setGravityY(-1000000);
    child.setVelocityY(distance_balle);
    child.setVelocityX(distance_balle);
    child.setCollideWorldBounds(true);
    child.setBounce(1);
    child.body.setAllowRotation();
});

//affichage de game over  non visible
this.gameOver_text = this.add.text(width_screen/2,height_screen/3,'GAME OVER',{fontFamily: 'impact',fontSize : '150px',fill : '#fff',color :'#ffffff '});
this.gameOver_text.setOrigin(0.5);
this.gameOver_text.visible = false;
   // affichage des buttons 
  this.start_button = this.add.text(width_screen/3,height_screen/2,'Restart',{fontFamily: 'impact',fontSize : '70px',fill : '#fff',color :'#ffffff '});
  this.start_button.setInteractive();
  this.start_button.once('pointerdown', function () {
    scores =0;
    this.scene.restart();
    this.physics.resume();
    
    }, this);  
    this.start_button.visible = false;
   
    //  gere les collisions
   this.physics.add.collider(fireball, fireball); 
   this.physics.add.collider(this.player, fireball,finJeu,null,this); // si collision fin du jeu
 
  function finJeu(player, fireBall){
    jeuFini = true ;
    music.stop();
    death_music.play();
    this.physics.pause();   
    player.setTint(0xFF0000);
    this.gameOver_text.visible = true;
    this.start_button.visible = true;
   
    const data ={
     score : scores
    };
    updateData("/jeu", data,localStorage.getItem("token"),"", "impossible de maj");
  }
   
  
  
  //gere le clavier 
  this.cursors = this.input.keyboard.createCursorKeys();
    

   this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('perso', { start:4, end: 7}),
        frameRate: 15,
        repeat: 1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('perso', { start: 8, end: 11 }),
        frameRate: 15,
        repeat: 1
    });
    
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 3}),
        frameRate:  15,
        repeat: 1
    });
    
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('perso', { start:13, end:16  }),
        frameRate: 15,
        repeat: 1
    });

 
},


update :function update ()
{
    var distance = 250;
    var cursors = this.cursors;
    var player = this.player;
    if( !jeuFini ){
    player.setDrag(2000);
    if (cursors.left.isDown)
    {
        player.setVelocityX(-distance);   
        player.anims.play('left',true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(distance);
        player.anims.play('right',true);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(distance);
        player.anims.play('up',true);
       
    }else if(cursors.up.isDown)
    {
        player.setVelocityY(-distance);
        player.anims.play('down',true);
    }
    
    // update du score et difficulté
     
 }
 

 
},


collectCoins : function (player, coin){
    
    //coin.disableBody(true, true);
    //coin.setY(Phaser.Math.Between(0,height_screen));
   // coin.setX(Phaser.Math.Between(0,width_screen));
    coin.body.reset(Phaser.Math.Between(0,width_screen), Phaser.Math.Between(0,height_screen));
    scores = updateScore(scores,this.score_text,gravite,distance_balle);
    if(scores >= base){
        base*=2;
        distance_balle+=90;
        gravite*=2;
        fireball.children.iterate(function (child) {     
            child.setVelocityY(distance_balle);
            child.setVelocityX(distance_balle);
            child.setGravityY(75);
        });
    } 
 
    
 }
 
});


let background_m =null;
var Start = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Start ()
    {
        Phaser.Scene.call(this, { key: 'start' });
        window.OVER = this;
    },
    preload : function(){
        this.load.image('background_menu','./images/fonddd.jpg');
    },
    create: function ()
    {
        this.background_m =this.add.image( width_screen, height_screen,'background_menu');
        this.background_m.setSize(100,200);
        this.background_m.setOrigin(1);
     
        this.start_button = this.add.text(width_screen/2,height_screen/2,'Start',{fontFamily: 'impact',fontSize : '100px',fill : '#fff',color :'#ffffff '});
        this.start_button.setInteractive();
        this.start_button.once('pointerdown', function () {
            this.scene.start('game');          
          }, this); 
    }

});


var config = {
    type : Phaser.AUTO,
    width: width_screen,
    height: height_screen,
   
    physics: {
       default: 'arcade',
       arcade: {
           gravity: { y: gravite },
           debug: false
       }
   },
   
    scene: [Start,Game]
       
   };
var game = new Phaser.Game(config);


