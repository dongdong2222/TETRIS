

var canvas  = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var px = 50;
//블록 객체


function Block1 () {
    var shape= [
                [[0,1],[1,1],[2,1],[3,1]],
                [[1,0],[1,1],[1,2],[1,3]],
               ];
    var color = "blue";
    var currentTurn = 0;
    var x = 3;
    var y = 0;

    //var currentShape = shape[currentTurn];
    function rotation () {
        if(i === 2)
            currentTurn = 0;
        else
            currentTurn++; 
    }
    function filledBlock(){
        var fillArea = new Array(4);
        for(let i=0; i<4; i++){
            fillArea = new Array(2);
            for(let j=0; j<2; j++){
                fillArea[i][j] = y+shape[currentTurn][i][j];
            }
        }
        return fillArea;

    }
    function drawBlock(){ //필드에 대한 좌표값을 받고 draw
          for(var i=0; i<4; i++){
              ctx.deginPath();
              ctx.rect((x+shape[currentTurn][i][1])*px, (y+shape[currentTurn][i][0])*px, px, px);
              ctx.fillStyle = color;
              ctx.fill();
              ctx.closePath();
          }


    }
    function falling() {

    }

   
}

function randomblock() {
    return new Block1();
}


function Field (width, height) {
    this.width = width;
    this.height = height;
    var currentBlock;
    var field = new Array(height);
    for(let i = 0; i<height; i++){
        field[i] = new Array(width);
    }

    function createBlock(){
        var rand = Math.floor(Math.random()*10);
        currentBlock = new randomBlock();
        
    }
    function DeleteLine(){
        var check = 0;
        for(var i=0; i<height; i++){
            for(var j=0; j<width; j++){
                if(field[i][j] === 1){
                    cheak++;
                }
            }
            if(cheak === 10){
                for(var k=0; k<width; k++){
                    for(var h=i; h>0; h++){
                        field[h][k] = field[h-1][k];
                    }

                }
            }
            cheak = 0;
        }
    }
    function drawField() {
        for(var i=0; i<height; i++){
            for(var j=0; j<width; j++){
                if(field[i][j] === 1 ){
                    ctx.beginPath();
                    ctx.rect(j*px, i*px, px, px);
                    ctx.fillStyle = "skyblue";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
}

function GameControler () { //필드 생성, 충돌판정, 
    var field = new Field(10, 40);

    function collisionDetection() { //충돌시 ture 아닐 시 false
       var fillArea =  field.currentTurn.filledArea();
       for(var i=0; i<4; i++){
           if(fillArea[i][0] === 1 || fillArea[i][1] === 1){
               return true;
           }
       }
    }

}

var gameControler = new GameControler();
var rightPressed = false;
var leftPressed = false;

function draw () {
    ctx.clearRect(canvas.width, canvas.height);
    gameControler.field.drawField();
    gameControler.field.currentBlock.drawBlock();
    if(rightPressed === ture && gameControler.field)

    requestAnimationFrame(draw);
}




document.addEventListener("keydown", keydownHandler); //false??
document.addEventListener("keyup", keyupHandler);
document.addEventListener("blocking", blockingHandler);

function keydownHandler(e){
    if(e.keyCode === 37){
        rightPressed = ture;
    }
    else if(e.keyCode === 39){
        rightPressed = ture;
    }
    else if(e.keyCode === 40){
        underPressed = turn;
    }
    else if(e.keyCode === 32){
        ;
        //pressed space
    }
}
function keyupHandler(e){

}
function blockingHandler(e) {

}
draw();
