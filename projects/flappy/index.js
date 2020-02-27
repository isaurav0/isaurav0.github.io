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
            // factor = 15 + GRAVITY
            this.y = this.y - 80;
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
    // this.size = 35
    this.size = 160
    this.speed = 0

    this.update = function(isActive){
            this.speed = Math.floor(score%25/5);
            // this.speed = 2
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
    last = 0
    for(i=0;i<walls.length;i++){
        if(walls[i].x > last){
            last = walls[i]
        }
    }
    return last
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
        console.log(walls[0])
        
        
        if( walls[0].speed = 4 ){ //0 speed config
            console.log("0 speed config added")
            // wall = new Wall(random(100,400), random(200,400), walls[walls.length-1].x+random(400,600))
            wall = new Wall(random(100,300), random(200,300), walls[walls.length-1].x+random(400,600))
            walls.push(wall)
        }
        
        if(walls[0].speed = 0){ //1 speed config
            console.log("speed 1 config added")
            wallHeight = random(100, 400)
            wall = new Wall(wallHeight, random(200,400), walls[walls.length-1].x+random(600,700))
        }

        if(walls[0].speed = 1){ //2 speed config
            console.log("speed 2 config added")
            wallHeight = random(100, 300)
            if(wallHeight - walls[walls.length-1].height>=300)
                wall = new Wall(wallHeight, random(200,350), walls[walls.length-1].x+random(900,1000))
            else 
                wall = new Wall(wallHeight, random(200,350), walls[walls.length-1].x+random(700,800))
        } 



        walls = walls.slice(1, )
            // walls[i]
        // if(wallHeight)
        // if(Math.abs(lastWall(walls).height-wallHeight)>100)
            // wall = new Wall(wallHeight, random(200,250), walls[walls.length-1].x+random(400,600))
        
    }
        
    for(i=0;i<walls.length;i++){
        if(isWallActive(bird, walls[i]))
            walls[i].update(true)
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

    GRAVITY+=0.2;
    window.requestAnimationFrame(runningState);
}


function gameSetup(){   
    canvas = document.getElementById('platform');
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    ctx = canvas.getContext('2d');        

    player = new Image();
    // player.src = "./images/charo.png";
    player.src = "./images/risako_charo.svg";

    score = 0;
    gameStop = false;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    GRAVITY = 0;
    bird = new Bird(80);
    walls = [];
    scoreUpdate = false
    startonclick = false
    walls[0] = new Wall(random(100,400), random(190,250), WIDTH) //for begining
    // walls[0] = new Wall(100,  200, WIDTH) //for speed 2 test
    readyToFly = true
    for(i=1;i<5;i++){
        walls[i] = new Wall(random(100,400), 190, walls[i-1].x+random(600,700)) //final
        // walls[i] = new Wall(random(100,400), 190, walls[i-1].x+random(800,900)) //for speed 2 test
    } 
    
    // walls[2] = new Wall(100, 190, walls[i-1].x+500)
    var request = window.requestAnimationFrame(runningState);
}

//if speed = 0
    // height = random(100,400)
    // distance = random(450,)

    // 100-400 = 500

//if speed = 1
    // height = random(100,400)


gameSetup();