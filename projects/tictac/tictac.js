// background image
var image = new Image();
image.src = "black.png";

//required
const width = 160;
const gap = 8;
var gameOver = false;
var gameStart = false;
var okayToMove = true;
var team = true;
var invalid = false;


//game Type 
var multiplayer = window.localStorage.getItem("multi")=="true" ? true : false;
var online = false;


//setup canvas
const canvas = document.getElementById("tictac");
const ctx = canvas.getContext("2d");
ctx.globalCompositeOperation = "source-over";
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.position = "absolute";

 
//start game
image.onload = function(){
    ctx.drawImage(image, 300, 100, 500,500);
    xstart = 300;
    ystart = 100;
    window.addEventListener("click", e => {
        if(!multiplayer){
            if(!gameOver && team && okayToMove){
                userplay(e, team);
                // wait(1000);
            }
            // wait(1000);
            if(!gameOver && !invalid && !team){
                setTimeout(()=>moveAI(),700)
            }
            invalid = false; 
        }
        else if(multiplayer && !online){
            if(!gameOver){
                userplay(e, team);
            }
        }
        else{
            if(gameStart){
                okayToMove = true
                if(!gameOver && myturn){
                    userplay(e, origteam);
                    if(okayToMove){
                        myturn = false;
                    }
                }
            }
        }
    });
}


//box properties
var box1={
    x: 340,
    y:220,
    checked: false,
    team: null,
    name: 'box1'
}

var box2={
    x: 340+width+gap,
    y:220,
    checked: false,
    team: null,
    name: 'box2'
}

var box3={
    x: 340+2*width+2*gap,
    y:220,
    checked: false,
    team: null,
    name: 'box3'
}

var box4={
    x: 340,
    y:220+width+gap,
    checked: false,
    team: null,
    name: 'box4'
}

var box5={
    x: 340+width+gap,
    y:220+width+gap,
    checked: false,
    team: null,
    name: 'box5'
}

var box6={
    x: 340+2*width+2*gap,
    y:220+width+gap,
    checked: false,
    team: null,
    name: 'box6'
}

var box7={
    x: 340,
    y:220+2*width+gap,
    checked: false,
    team: null,
    name: 'box7'
}

var box8={
    x: 340+width+gap,
    y:220+2*width+gap,
    checked: false,
    team: null,
    name: 'box8'
}

var box9={
    x: 340+2*width+2*gap,
    y:220+2*width+gap,
    checked: false,
    team: null,
    name: 'box9'
}

box = [null, box1, box2, box3, box4, box5, box6, box7, box8, box9]


//gameplay
function userplay(e, player){

    //clear error
    ctx.fillStyle = "Black";
    ctx.fillRect(378,613, 800,608);

    if(e.x>xstart && e.x<xstart+width && e.y>ystart && e.y<ystart+width && !box1.checked){
        check(box[1], player)
    }

    else if(e.x>xstart+width+gap && e.x<xstart+2*width+gap && e.y>ystart && e.y<ystart+width && !box2.checked){
        check(box[2],player)
    }

    else if(e.x>xstart+2*width+2*gap && e.x<xstart+3*width+2*gap && e.y>ystart && e.y<ystart+width && !box3.checked){
        check(box[3], player)
    }

    else if(e.x>xstart && e.x<xstart+width && e.y>ystart+width+gap && e.y<ystart+2*width+gap && !box4.checked){
        check(box[4], player)
    }

    else if(e.x>xstart+width+gap && e.x<xstart+2*width+gap && e.y>ystart+width+gap && e.y<ystart+2*width+gap && !box5.checked){
        check(box[5], player)
    }

    else if(e.x>xstart+2*width+2*gap && e.x<xstart+3*width+2*gap && e.y>ystart+width+gap && e.y<ystart+2*width+gap && !box6.checked){
        check(box[6], player)
    }
    
    else if(e.x>xstart && e.x<xstart+width && e.y>ystart+2*width+2*gap && e.y<ystart+3*width+2*gap && !box7.checked){
        check(box[7], player)
    }
    
    else if(e.x>xstart+width+gap && e.x<xstart+2*width+gap && e.y>ystart+2*width+2*gap && e.y<ystart+3*width+2*gap && !box8.checked){
        check(box[8], player)
    }

    else if(e.x>xstart+2*width+2*gap && e.x<xstart+3*width+2*gap && e.y>ystart+2*width+2*gap && e.y<ystart+3*width+2*gap && !box9.checked){
        check(box[9], player)
    }

    else{
        ctx.fillStyle = '#00B4EB';
        ctx.font = "50px Courier"
        ctx.fillText("Invalid Move", 390,647);
        invalid = true
        team = !team
        okayToMove = false
    }

    //for single player
    if((!online)){//review this line
        okayToMove = !okayToMove
        team = !team
    }
    else{
        turn(!player)
    }
};


var scores ={
    'X': -10,
    'O': 10,
    'tie': 0
}

function minimax(box, depth, isMax){

    let result = checkWinner(isMax, true) //check if Game over

    if(result!==null){
        return isMax ? scores[result]-depth : scores[result]+depth //greater the depth, lower the score for maximizing player
    }
    
    let unchecked = []  
    let bestScore = isMax ? -Infinity: Infinity 
    for(i=1;i<10;i++){
        if(!box[i].checked)
            unchecked.push(box[i]);            //take out all unchecked boxes
    }


    //play all the possible moves alternately
    unchecked.forEach(move => {
        fakeCheck(move, !isMax) // pretend playing, dont draw on canvas
        let score = minimax(box, depth+1, !isMax) // let alternate player play
        unCheck(move)  //make things normal to make choices with other moves
        bestScore = isMax ? Math.max(score, bestScore) : Math.min(score, bestScore) //Maximizing player maximizes score, minimizing minimizes
    });

    return bestScore

}


//AI's move
function moveAI(){
    let bestScore = -Infinity;
    var bestMove;
    let unchecked=[];
    let confirmWin = false;

    //find unchecked boxes
    for(i=1;i<10;i++){
        if(!box[i].checked && !team){
            unchecked.push(box[i])            
        }
    }

    unchecked.forEach(move => {
        fakeCheck(move, false)  //ai chooses this moves
        let score = minimax(box, 0, false) //lets minimzing player move 
        unCheck(move)   //uncheck this and check other to see the best move
        console.log(move.name, score)

        if( score > bestScore && !confirmWin  ){     //because winning score is 10 at 0 depth
            bestScore = score
            bestMove = move
        }

        if(score==10){
            confirmWin = true
        }
    })

    check(bestMove,team) 
    team = true;
    okayToMove = true;
}


function fakeCheck(box, team){      //change property of box but dont draw on canvas 
    box.team = team;
    box.checked = true
}

function unCheck(box){
    box.team = null
    box.checked = false
}

//turn
function turn(team){
    if(team){
        ctx.fillStyle = "black";
        ctx.fillRect(820,290,945,290)
        ctx.fillStyle = "orange";
        ctx.font = "40px Arial"
        ctx.fillText("×",62,350);
    }
    if(!team){
        ctx.fillStyle = "black";
        ctx.fillRect(34,290,155,290)
        ctx.fillStyle = "green";
        ctx.font = "25px Arial"
        ctx.fillText("◯",1000,350);
    }
}



//if game over
window.onclick=function(){
    if(gameOver){
        if(!online){
            location.reload();
        }
        else{
            gameStart = false;
            gamereset();
        }
        
    }
}


function check(box, team){      //to point a box and draw
    box.team = team;
    box.checked = true
    document.getElementById("draw").play()
    wait(200)
    if(team==true){
        ctx.font = "150px Arial";
        ctx.fillStyle = 'orange';
        ctx.fillText("×",box.x,box.y);
    }
    if(team==false){
        ctx.font = "bolder 85px Arial";
        ctx.fillStyle = 'green';
        ctx.fillText("◯", box.x, box.y);
    }    

    checkWinner(team,false);
    if(!gameOver){
        if(!online){
            turn(!team);
        }
        else{
            turn(!origteam);
        }
    }
}



function checkWinner(team, isFake){         //isFake to implement AI playing so AI's recursive moves don't get drawn
    var k =0;
    var flag = 0;
    for(i=1;i<4;i++){
        //vertical
        if(box[i].checked && box[i+3].checked && box[i+6].checked && box[i].team==box[i+3].team && box[i].team==box[i+6].team )
        {
            if(isFake)
                return team ? "X" : "O"
            else                
                drawline(team, 387+(i-1)*(width+gap), 108 , 387+(i-1)*(width+gap), 605);            
        }
        
        //horizontal
        var j=i+k;
        if(box[j].checked && box[j+1].checked && box[j+2].checked && box[j].team==box[j+1].team && box[j].team==box[j+2].team)
        {                           
            if(!isFake)
                drawline(team, 293,174+(i-1)*(width+gap), 800, 174+(i-1)*(width+gap));
            else
                return team ? "X" : "O"
        }
        k+=2;

        //diagonal
        if(i==1 && box[i].checked && box[i+4].checked && box[i+8].checked && box[i].team==box[i+4].team && box[i].team==box[i+8].team)
        {
            if(!isFake)
                drawline(team, 296, 112, 802, 585);
            else
                return team ? "X" : "O"
        }
        
        //diagonal
        if(i==3 && box[i].checked && box[i+2].checked && box[i+4].checked && box[i].team==box[i+2].team && box[i].team==box[i+4].team)
        {
            if(!isFake)
                drawline(team, 798, 109, 297, 591);
            else
                return team ? "X" : "O"
        }
    }

    //if all checked 
    for(i=1;i<10;i++){
        if(box[i].checked)
            flag+=1;
        else 
        {
            flag=0;
            break;
        }
    }
    if(flag>8){
        if(isFake)
            return 'tie'
        gameOver = true;
        myturn = true     
    }
    return null
}

//wait
function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
};


function drawline(team, moveX, moveY, lineX, lineY ){
        console.log("gameOver")
        ctx.beginPath();
        ctx.moveTo(moveX, moveY);
        ctx.lineTo(lineX, lineY);
        ctx.lineWidth = "8";
        if(team){
            ctx.strokeStyle ="orange";
            ctx.stroke();
        }
        if(!team){
            ctx.strokeStyle ="green";
            ctx.stroke();
        }
        gameOver= true;
        myturn = true
}