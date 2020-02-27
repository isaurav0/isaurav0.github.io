window.addEventListener('resize', e=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
});


function Bird(size){
    this.size = size;
    this.x = 10
    // this.y = HEIGHT/2
    this.y = 0
    this.drawBird = function(){
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.x,this.y, size, size);
        // ctx.fill();
        ctx.drawImage(player, this.x,this.y, size, size);
    }

    this.update = function(clicked, GRAVITY){
        this.clearCanvas()
        if(clicked && this.y>0){
            readyToFly = false
            factor = 15 + GRAVITY
            this.y = this.y - 15;
            const wingAudio = document.getElementById("wing");
            wingAudio.play();
            setTimeout(function() { readyToFly= true }, 000);
        }
        else if(this.y<HEIGHT-15){
            this.y = this.y + GRAVITY ;
            // this.clearCanvas()
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


function Wall(height, gap, x){
    this.height = height
    this.gap = gap
    this.x = x 
    this.size = 35

    this.update = function(isActive){
        if(score>25 && score<30){
            this.x -= 2
        }
        else{
            speed = Math.floor(score%25/5);
            this.x -=2 + speed

        }
            
        if(isActive)
            ctx.fillStyle = "orange";
        else
            ctx.fillStyle = "green";
        this.drawWall();
    }

    this.drawWall = function(){                
        ctx.fillRect(this.x,0, this.size, height);
        ctx.fillRect(this.x-3,height-4, this.size+6, 4);

        ctx.fillRect(this.x,height+gap, this.size, HEIGHT);
        ctx.fillRect(this.x-3,height+gap-2, this.size+6, 4);
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

function collide(bird, wall){
    if(isWallActive(bird, wall) && ((bird.y <= wall.height) || bird.y+bird.size >= (wall.height+wall.gap))){
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


function gameSetup(){   
    canvas = document.getElementById('platform');
    ctx = canvas.getContext('2d');    

    player = new Image(7, 7);
    player.src = "./images/don.png";

    score = 0;
    gameStop = false;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    GRAVITY = 0;
    bird = new Bird(20);
    walls = [];
    scoreUpdate = false
    startonclick = false
    walls[0] = new Wall(random(10,60), random(50,60), WIDTH)
    readyToFly = true
    for(i=1;i<5;i++){
        // Wall(height, gap, x)
        walls[i] = new Wall(random(10,60), 50, walls[i-1].x+random(100,200))
        // walls[i] = new Wall(random(10,60), walls[i-1].x )
        // console.log(walls[i-1].x)
        // console.log(walls[i])
        // walls[i] = new Wall(1 , 35, i, 50, 1)
    }    
    var request = window.requestAnimationFrame(runningState);
}

function random(min, max){
    return Math.floor(Math.random() * (+max - +min) + +min )
}



function runningState(){
    //bird.update(clicked, GRAVITY)  GRAVITY is for accelerating in freefall
    bird.update(false, GRAVITY)
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
    
    //implement queue for walls
    if(walls[0].x < - walls[0].size - 10){
        walls = walls.slice(1, )
        // Wall(height, size, turn, gap, distance)
        wall = new Wall(random(10,60), random(50,60), walls[walls.length-1].x+random(100,200))
        walls.push(wall)
    }
        
    for(i=0;i<walls.length;i++){
        if(isWallActive(bird, walls[i]))
            walls[i].update(false)
        else
            walls[i].update(false)
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

    GRAVITY+=0.05;
    window.requestAnimationFrame(runningState);
}


gameSetup();