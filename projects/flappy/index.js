window.addEventListener('resize', e=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
});


function Bird(size){
    this.size = size;
    this.x = 30
    this.y = HEIGHT/2-200
    // this.y = 0
    this.drawBird = function(){
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.x,this.y, size, size);
        // ctx.fill();
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(player, this.x,this.y, size, size);
    }

    this.update = function(clicked, GRAVITY){
        this.clearCanvas()
        if(clicked && this.y>0){
            readyToFly = false
            this.y = this.y - 80;
            const wingAudio = document.getElementById("wing");
            wingAudio.play();
            setTimeout(function() { readyToFly= true }, 000);
        }
        else if(this.y<HEIGHT-15){
            this.y = this.y + GRAVITY ;
        }
        else{

        }
        this.drawBird();
        
    }

    this.clearCanvas= function(){
        ctx.clearRect(0,0,WIDTH, HEIGHT);
        ctx.fill();
    }
}


function Wall(height, gap, x, config){
    this.height = height
    this.gap = gap
    this.x = x 
    this.size = 160
    this.speed = 0
    this.config = config

    this.update = function(isActive){
            this.speed = Math.floor(score%25/5);
            this.x -=(2 + this.speed)*5

        if(isActive)
            ctx.fillStyle = "orange";
        else
            ctx.fillStyle = "green";
        this.drawWall();
    }

    this.drawWall = function(){                
        ctx.fillRect(this.x,0, this.size, height);
        ctx.fillRect(this.x-7,height-40, this.size+14, 40);

        ctx.fillRect(this.x,height+gap, this.size, HEIGHT);
        ctx.fillRect(this.x-7,height+gap, this.size+14, 40);
        ctx.fill();
    }
   
}

function gameOver(bird, wall){
    if(bird.y>=HEIGHT-bird.size){        
        return true
    }
    else if(collide(bird,wall)){
        return true
    } 
    else{
        return false
    }
}

// function collide(bird, wall){
//     if(isWallActive(bird, wall) && ((bird.y <= wall.height) || bird.y+bird.size >= (wall.height+wall.gap))){
//         return true
//     }
//     else
//         return false
// }

function collide(bird, wall){
  
    if(isWallActive(bird, wall)){
        if (bird.y <= wall.height)
            return true
        if(bird.y+bird.size >= (wall.height+wall.gap))
            return true
    }
    else
        return false
}


function isWallActive(bird, wall){    

    //from front and back
    if(bird.x+bird.size >= wall.x && bird.x <= wall.x + wall.size)
        return true
    else
        return false

}

window.addEventListener("keypress", function(e){
    if(!gameStop && readyToFly){
        bird.update(true, GRAVITY);
        GRAVITY = 0
    }

    if(startonclick){
        window.location.reload()
    }
})


function random(min, max){
    return Math.floor(Math.random() * (+max - +min) + +min )
}


function lastWall(walls){
    last = new Wall(0,0,0,'test wall')
    for(i=0;i<walls.length;i++){
        if(walls[i].x > last.x){
            last = walls[i]
        }
    }
    return last
}


function runningState(){
    //bird.update(clicked, GRAVITY)  GRAVITY is for accelerating in freefall
    bird.update(false, GRAVITY)
    // speed = Math.floor(score%25/5);

    //update score
    if(isWallActive(bird, walls[0]))
        scoreUpdate = true
    else{
        if(scoreUpdate){
            score++;
            const clickAudio = document.getElementById("click");
            clickAudio.play();

            //show score
            scoreBoard = document.getElementById("score");
            scoreBoard.innerText = score
            scoreUpdate = false

            var highscore = window.localStorage.getItem('score')
            if(score> highscore){
                window.localStorage.setItem('score', score)
                scoreBoard = document.getElementById('globalscore')
                scoreBoard.innerText = score
            }

        }
    }
    
    // implement queue for walls
    if(walls[0].x < - walls[0].size - 10){

        speed = Math.floor(score%25/5);
        wallHeight = random(100, 400)
        lastHeight = walls[walls.length-1].height
        
        if( speed == 4 ){ //0 speed config
            // wall = new Wall(random(100,400), random(200,400), walls[walls.length-1].x+random(400,600))
            wall = new Wall(random(100,300), random(200,300), walls[walls.length-1].x+random(400,600), "config 0 speed")
            // walls.push(wall)
        }
        
        if(speed == 0){ //1 speed config completed
            if(wallHeight - lastHeight>=250)
                wall = new Wall(wallHeight, random(200,300), lastWall(walls).x+random(650,700), "config 1 wall")
            else
                wall = new Wall(wallHeight, random(200,300), lastWall(walls).x+random(600,700), "config 1 wall")
        }

        if(speed == 1){ //2 speed config completed
            wallHeight = random(100, 300)
            if(wallHeight - lastHeight>=250)
                wall = new Wall(wallHeight, random(200,350), walls[walls.length-1].x+900, "config 2 speed")
            else 
                wall = new Wall(wallHeight, random(200,350), walls[walls.length-1].x+random(700,800), "config 2 speed")
        } 

        if(speed == 2){ //3 speed config remaining to be tuned
            wallHeight = random(100,200)
            if(wallHeight - lastHeight>=300)
                wall = new Wall(wallHeight, random(200,350), walls[walls.length-1].x+1200, "config 3")
            else 
                wall = new Wall(wallHeight, random(200,350), walls[walls.length-1].x+random(500,1200), "config 3")
        }

        if(speed == 3){ // 4 speed config
            wallHeight = random(100, 300)
            if(wallHeight - lastHeight>=100)
                wall = new Wall(wallHeight, random(200,350), walls[walls.length-1].x+1300, "config 4 speed")
            else 
                wall = new Wall(wallHeight, random(200,350), walls[walls.length-1].x+random(700,800), "config 4 speed")
        }

        walls.push(wall)
        walls = walls.slice(1, )
    }

    for(i=0;i<walls.length;i++){
        if(score==prevHighscore && i==0){
            walls[0].update(true)
        }
        else{
            walls[i].update(false)
        }
            
    }
        
    if(gameOver(bird, walls[0])){
        const gameOverMusic = document.getElementById("gameOver");
        gameOverMusic.play()
        gameStop = true 
        const playAgain = document.getElementById("start");
        const mainMenu = document.getElementById("mainmenu");
        playAgain.style.visibility= "visible"
        mainMenu.style.visibility= "visible"
        setTimeout(function() { startonclick= true }, 500);
        return
    }


    GRAVITY+=0.2;
    window.requestAnimationFrame(runningState);
}


function gameSetup(){   
    canvas = document.getElementById('platform');
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    ctx = canvas.getContext('2d');        

    player = new Image();
    player.src = "./images/risako_charo.svg";
    // player.src = "./images/muji.png";
    // player.src = "./images/kale.png";
    // player.src = "./images/suste.png";
    // player.src = "./images/chutiya.png";

    score = 0;
    gameStop = false;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    GRAVITY = 0;
    bird = new Bird(80);
    walls = [];
    scoreUpdate = false
    startonclick = false
    prevHighscore = window.localStorage.getItem('score')
    walls[0] = new Wall(random(100,400), random(190,250), WIDTH, "config 0 ") //for begining
    readyToFly = true
    for(i=1;i<5;i++){
        walls[i] = new Wall(random(100,400), random(190,250), walls[i-1].x+random(600,700), "config 0 ") //final
      
    } 
    var request = window.requestAnimationFrame(runningState);
}

gameSetup();