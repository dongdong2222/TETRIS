

var canvas  = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var px = 30;


function create2DArray(width, height) {
    var arr = new Array(height);
    for(var i=0; i<height; i++){
        arr[i] = new Array(width).fill(0);
        if(i == (height-1))
            arr[i].fill(1);
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
    interval;

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
//     underPosition() {
//         var under = 0;
//         for(var i=0; i<4; i++){
//             if(under < this.shape[this.currentTurn][i][1])
//                 under = this.shape[this.currentTurn][i][1];
//         }
//         return under + this.y;
//     }
    
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
            fillArea[i] = new Array(2);
            for(let j=0; j<2; j++){
                if(j === 0)
                    fillArea[i][j] = this.x+this.shape[this.currentTurn][i][j];
                else if(j === 1)
                    fillArea[i][j] = this.y+this.shape[this.currentTurn][i][j];
            }
        }
        return fillArea;

    }
    drawBlock(){
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
        this.interval = setInterval(() => {this.y++;}, 1000);
        
    }
    landing () {
        clearInterval(this.interval);
    }

    moveBlock(control){ //0 : 가만히 -1: 왼쪽 1: 오른쪽 2: 아래쪽
        if(control === -1 ){
            if(this.leftPosition() == 0)
                return;
            this.x--;
            console.log(gameField.currentBlock.x);

        }
        else if(control === 1){
            if(this.rightPosition() == 9) //블록 크기도 생각해줘야함(or index값으로 계산하므로)
                return;
            this.x++;
            console.log(gameField.currentBlock.x);
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
        this.field = create2DArray(this.width, this.height+1);
        this.currentBlock = new Block1();

        
    }
    

    createBlock(){
        var rand = Math.floor(Math.random()*10);
        this.currentBlock = new Block1();
        
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

    colision () {   //옆에서 부딪혔을때 오류
        console.log("if");
        var iscol = false;
        var filledArea = this.currentBlock.filledBlock();
        for(var i=0; i<4; i++){
            if(this.field[filledArea[i][1]][filledArea[i][0]] === 1)
                return iscol = true;
        }
    }

    landBlock() {
        console.log("landBlock");
        if(this.colision()){
            console.log("coll");
            this.currentBlock.y--;
            var filledArea = this.currentBlock.filledBlock();

            for(var i=0; i<4; i++){
                this.field[filledArea[i][1]][filledArea[i][0]] = 1;
            }
            this.currentBlock.landing();

            this.createBlock();
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
                if(this.field[i][j] === 1 ){
                    ctx.beginPath();
                    ctx.rect(j*px, i*px, px, px);
//                     ctx.fillStyle = "black";
//                     ctx.fill();
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
}


var gameField = new Field(10, 20);


var control = 0;
var turn = false;

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameField.landBlock();
    gameField.drawField();
    gameField.currentBlock.drawBlock();

    gameField.currentBlock.moveBlock(control);
    if(turn){
        gameField.currentBlock.rotation();
        turn = false;
    }
    control = 0;

    requestAnimationFrame(draw);
}




document.addEventListener("keydown", keydownHandler); //false??
document.addEventListener("keyup", keyupHandler);
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

draw();
