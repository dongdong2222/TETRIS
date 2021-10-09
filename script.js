

var canvas  = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var px = 30;


function create2DArray(width, height) {
    var arr = new Array(height);
    for(var i=0; i<height; i++){
        arr[i] = new Array(width).fill(0);
    }
    return arr;
}

class Block1 {  //class field를 다른 메서드가 사용할때 this를 꼭 붙여야하는지?? -> 붙여야 한다!! but Why?
    constructor() {
        this.falling();
    }
    shape= [
            [[1,0],[1,1],[1,2],[1,3]],
            [[0,1],[1,1],[2,1],[3,1]],
           ];
    color = "blue";
    strokeColor = "black"
    currentTurn = 0;
    x = 3;
    y = 0;

    leftPosition() {
        var minimum = 100;
        for(var i=0; i<4; i++){
            if(minimum > this.shape[this.currentTurn][i][0])
                minimum = this.shape[this.currentTurn][i][0];
        }
        return minimum+this.x;
    }

    rightPosition() {
        var maximum = -1;
        for(var i=0; i<4; i++){
            if(maximum < this.shape[this.currentTurn][i][0])
                maximum = this.shape[this.currentTurn][i][0];
        }
        return maximum + this.x;
    }
    
    //var currentShape = shape[currentTurn];
    rotation () {  // 벽에 붙어있을때 회전시 블록이 밖으로 나감
        if(this.currentTurn === 1)
            this.currentTurn = 0;
        else
            this.currentTurn++; 
    }
    filledBlock(){
        var fillArea = new Array(4);
        for(let i=0; i<4; i++){
            fillArea = new Array(2);
            for(let j=0; j<2; j++){
                fillArea[i][j] = y+shape[currentTurn][i][j];
            }
        }
        return fillArea;

    }
    drawBlock(){ //필드에 대한 좌표값을 받고 draw
        for(var i=0; i<4; i++){
//             console.log(this.x+this.shape[this.currentTurn][i][0]);
//             console.log(this.y+this.shape[this.currentTurn][i][1]);
            ctx.beginPath();
            ctx.rect((this.x+this.shape[this.currentTurn][i][0])*px, (this.y+this.shape[this.currentTurn][i][1])*px, px, px);
            ctx.fillStyle = this.color;
            ctx.fill();
//             ctx.strokeStyle = this.strokeColor;
//             ctx.stroke();
            ctx.closePath();
        }


    }
    falling () {
        //console.log(this);
        setInterval(() => {this.y++;}, 1000);
        
    }

    moveBlock(control){ //0 : 가만히 -1: 왼쪽 1: 오른쪽
        if(control === -1 ){
            if(this.leftPosition() == 0)
                return;
            this.x--;
            console.log(block.x);

        }
        else if(control === 1){
            if(this.rightPosition() == 9) //블록 크기도 생각해줘야함
                return;
            this.x++;
            console.log(block.x);
        }
        else if(control === 2){
            this.y++;
        }


    }
   
}

function randomblock() {
    return new Block1();
}


class Field {
    
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.field = create2DArray(this.width, this.height);

        
    }
    

    createBlock(){
        var rand = Math.floor(Math.random()*10);
        currentBlock = new randomBlock();
        
    }
    DeleteLine(){
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
    drawField() {
        ctx.beginPath();
        ctx.rect(0,0, this.width*px, this.height*px);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
        for(var i=0; i<this.height; i++){
            for(var j=0; j<this.width; j++){
                if(this.field[i][j] === 0 ){
                    ctx.beginPath();
                    ctx.rect(j*px, i*px, px, px);
                    //ctx.fillStyle = "black";
                    //ctx.fill();
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
}




function collisionDetection() { //충돌시 ture 아닐 시 false
   var fillArea =  field.currentTurn.filledArea();
   for(var i=0; i<4; i++){
        if(fillArea[i][0] === 1 || fillArea[i][1] === 1){
            return true;
        }
      }
   }


var gameField = new Field(10, 20);
var block = new Block1();



var control = 0;
var turn = false;

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameField.drawField();
    block.drawBlock();

    block.moveBlock(control);
    if(turn){
        block.rotation();
        turn = false;
    }

    requestAnimationFrame(draw);
}




document.addEventListener("keydown", keydownHandler); //false??
document.addEventListener("keyup", keyupHandler);
document.addEventListener("blocking", blockingHandler);

function keydownHandler(e){
    if(e.keyCode === 37){ //완쪽 방향키
        control = -1;
    }
    else if(e.keyCode === 39){ //오른쪽 방향키
        control = 1; 
    }
    else if(e.keyCode === 40){ //아래 방향키
        control = 2;
    }
    else if(e.keyCode === 38){ //윗 방향키
        turn = true;
    }
}
function keyupHandler(e){
    if(e.keyCode === 37){ //완쪽 방향키
        control = 0;
    }
    else if(e.keyCode === 39){ //오른쪽 방향키
        control = 0; 
    }
    else if(e.keyCode === 40){ //아래 방향키
        control = 0;
    }

}
function blockingHandler(e) {

}
draw();
