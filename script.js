var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var px = 40;

function create2DArray(width, height) {
    var w = width+2;
    var h = height+5;
    var arr = new Array(h);
    for(var i=0; i<h;i++){
        arr[i] = new Array(w);
        for(var j=0; j<w; j++){
            if(j==0 || j== w-1){
                arr[i][j] = 1;
            }
            else {
                arr[i][j] = 0;
            }
        }
        if(i === h-1)
            arr[i].fill(1);
    }
    return arr;
}
function randomBlock(rand){

        return new Block();
}

class Block {
    constructor () {
        this.falling();
    }
    shape = [
             [[0,0],[0,1],[0,2],[0,3]],
             [[0,0],[1,0],[2,0],[3,0]]
    ];
    x = 4;
    y = 1;
    color = "blue";
    currentTurn = 0;
    interval;

    rotation (direct) {
        if(this.currentTurn === 1 && direct == 1)
            this.currentTurn = 0;
        else if(this.currentTurn === 0 && direct == -1)
            this.currentTurn = 1;
        else
            this.currentTurn += direct;
    }

    drawBlock() {
        for(var i=0;i<4; i++){
            ctx.beginPath();
            ctx.rect((this.x+this.shape[this.currentTurn][i][0])*px, (this.y+this.shape[this.currentTurn][i][1]-4)*px, px, px);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
    filledBlock() {
        var Area = new Array(4);
        for(let i=0; i<4; i++){
            Area[i] = new Array(2);
            Area[i][0] = this.x+this.shape[this.currentTurn][i][0];
            Area[i][1] = this.y+this.shape[this.currentTurn][i][1];
        }
        return Area;
    }
    
    falling() {
        this.interval = setInterval(() => {this.y++;}, 1000);
    }
    landing() {
        clearInterval(this.interval);
    }

    moveBlock(key) {
        if(key === -1) {
            this.x--;
        }
        else if(key === 1){
            this.x++;
        }
        else if(key === 2){
            this.y++;
        }

    }
}

class Field {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.field = create2DArray(width, height);
    }
    color = "black";

    deleteLine(i) {
        console.log("work %d", i);
        for(var k=1; k<this.width+1; k++){
            for(var h=i; h>0; h--){
                this.field[h][k] = this.field[h-1][k]; 
            }

        }
    }

    drawField() {
        ctx.beginPath();
        ctx.rect(px,0,this.width*px, this.height*px);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
        for(var i=0; i<this.height; i++){
            for(var j=1; j<this.width+1; j++){
                if(this.field[i+3][j] == 1){
                    ctx.beginPath();
                    ctx.rect(j*px, i*px, px, px);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

}

class Control {
    constructor(width, height) {
        this.fieldA = new Field(width, height);
        this.ran = [];
        this.ran.push(Math.floor(Math.random()*6)+1);
        this.ran.push(Math.floor(Math.random()*6)+1);
        this.ran.push(Math.floor(Math.random()*6)+1);
        this.ran.push(Math.floor(Math.random()*6)+1);
        this.currentBlock = randomBlock(this.ran.shift());
        this.ran.push(Math.floor(Math.random()*6)+1);
    }

    draw (){
        this.fieldA.drawField();
        this.currentBlock.drawBlock();
    }
    createBlock () {
        this.currentBlock = randomBlock(this.ran.shift());
        this.ran.push(Math.floor(Math.random()*6)+1);
    }

    collision(){
        var iscol = false;
        var filled = this.currentBlock.filledBlock();
        for(var i=0; i<4; i++){
            if(this.fieldA.field[filled[i][1]][filled[i][0]] === 1){
                return iscol = true;
            }
        }
        return iscol;
    }

    control (key) {
        if(key === -1 || key === 1){
            this.currentBlock.moveBlock(key);
            if(this.collision())
                this.currentBlock.moveBlock(key*(-1));
        }
        else if(key === 2) {
            this.currentBlock.moveBlock(key);
            if(this.collision())
                this.currentBlock.y--;
        }
        else if(key === 3 || key === 4){
            var pos = {x: this.currentBlock.x, y: this.currentBlock.y};
            var direct = key ===3?1:-1; 
            var count =0;
            this.currentBlock.rotation(direct);
            console.log("rota");
            while(this.collision()) {
                if(count == 2){
                    this.currentBlock.x  = pos.x;
                    this.currentBlock.y  = pos.y;
                    this.currentBlock.rotation(direct*(-1));
                    count = 0;
                    break;
                }
                console.log("move back");
                this.currentBlock.moveBlock(-1);

                count++;
            }
            while(this.collision()) {
                if(count == 2){
                    this.currentBlock.x  = pos.x;
                    this.currentBlock.y  = pos.y;
                    this.currentBlock.rotation(direct*(-1));
                    count = 0;
                    break;
                }
                this.currentBlock.moveBlock(1);

                count++;
            }
            while(this.collision()) {
                if(count >= 1){
                    this.currentBlock.moveBlock(2);
                    count++;
                    if(count = 3){
                        this.currentBlock.x  = pos.x;
                        this.currentBlock.y  = pos.y;
                        this.currentBlock.rotation(direct*(-1));
                        count = 0;
                        break;

                    }
                }
                this.currentBlock.moveBlock(1);
                count++;
            }


        }
        else if(key === 5){
            while(!this.collision()){
                this.currentBlock.y++;
            }
        }

            
    }

    land(){
        if(this.collision()) {
            this.currentBlock.y--;
            var filled = this.currentBlock.filledBlock();

            for(var i=0; i<4; i++){
                this.fieldA.field[filled[i][1]][filled[i][0]] = 1;
            }
            this.currentBlock.landing();
            this.currentBlock.drawBlock();
            this.createBlock();
            this.cheakDelete();
            this.checkGameOver();
        }
    }
    checkGameOver () {
        var line = this.fieldA.field[2];
        for(var i = 1; i<11; i++){
            if(line[i] === 1){
                document.location.reload();
                alert("GAME OVER");
                
            }
        }
    }
    cheakDelete() {
        console.log("check");
        var check = 0;
        for(var i=0; i<this.fieldA.height; i++){
            for(var j=1; j<this.fieldA.width+1; j++){
                if(this.fieldA.field[i][j] === 1){
                    check++;
                    console.log(check);
                }
            }
            if(check == 10){
                this.fieldA.deleteLine(i);
            }
            check = 0;
        }
        
    }
}

var game  = new Control(10, 20);
var control =0;

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw();
    game.control(control);
    game.land();



    control = 0;
    requestAnimationFrame(main);
}

document.addEventListener("keydown", keydownHandler);
function keydownHandler(e) {
    if(e.keyCode == 37)
        control = -1;
    else if(e.keyCode == 39)
        control = 1;
    else if(e.keyCode == 40)
        control = 2;
    else if(e.keyCode == 38)
        control = 3;
    else if(e.keyCode == 17)
        control = 4;
    else if(e.keyCode == 32)
        control = 5;
}
main();
