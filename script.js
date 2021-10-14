var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var px = 45;

function create2DArray(width, height) {
    var w = width+2;
    var h = height+3;
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
        if(rand == 1)
            return new Block1();
        else if(rand == 2)
            return new Block2();
        else if(rand ==3)
            return new Block3();
        else if(rand == 4)
            return new Block4();
        else if(rand == 5)
            return new Block5();
        else if(rand == 6)
            return new Block6();
        else if(rand == 7)
            return new Block7();
}

class Block {
    constructor () {
        this.falling();
    }
    shape;
    x = 4;
    y = 0;
    color = "blue";
    currentTurn = 0;
    interval;

    rotation (direct) {
        if(this.currentTurn === 3 && direct == 1)
            this.currentTurn = 0;
        else if(this.currentTurn === 0 && direct == -1)
            this.currentTurn = 3;
        else
            this.currentTurn += direct;
    }

    drawBlock(x, y) {
        for(var i=0;i<4; i++){
            ctx.beginPath();
            ctx.rect((x+this.x+this.shape[this.currentTurn][i][0]-1)*px, (y+this.y+this.shape[this.currentTurn][i][1]-2)*px, px, px);
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
class Block1 extends Block {
    constructor () {
        super();
        this.shape = [
                        [[0,1],[1,1],[2,1],[3,1]],
                        [[2,0],[2,1],[2,2],[2,3]],
                        [[0,2],[1,2],[2,2],[3,2]],
                        [[1,0],[1,1],[1,2],[1,3]]
        ];
        this.color = "#0f9bd7";
    }
}
class Block2 extends Block {
    constructor () {
        super();
        this.shape = [
                        [[0,1],[1,1],[2,1],[1,0]],       
                        [[1,0],[1,1],[1,2],[2,1]],
                        [[0,1],[1,1],[2,1],[1,2]],
                        [[1,0],[1,1],[1,2],[0,1]]
                        
        ];
        this.color = "#af298a"
    }
}
class Block3 extends Block {
    constructor () {
        super();
        this.shape = [
                        [[0,1],[1,0],[1,1],[2,0]],
                        [[0,0],[0,1],[1,1],[1,2]],
                        [[0,1],[1,0],[1,1],[2,0]],
                        [[1,0],[1,1],[2,1],[2,2]]
                        
        ];
        this.color = "#59b101";
    }
}
class Block4 extends Block {
    constructor () {
        super();
        this.shape = [
                        [[0,0],[1,0],[1,1],[2,1]],
                        [[0,1],[0,2],[1,0],[1,1]],
                        [[0,0],[1,0],[1,1],[2,1]],
                        [[1,1],[1,2],[2,0],[2,1]]
        ];
        this.color = "#d70f37";
    }
}
class Block5 extends Block {
    constructor () {
        super();
        this.shape = [
                        [[0,1],[1,1],[2,1],[2,0]],
                        [[1,0],[1,1],[1,2],[2,2]],
                        [[0,0],[0,1],[1,0],[2,0]],
                        [[1,0],[2,0],[2,1],[2,2]]
        ];
        this.color = "#e35b02";
    }
}
class Block6 extends Block {
    constructor () {
        super();
        this.shape = [
                        [[0,0],[0,1],[1,1],[2,1]],
                        [[1,0],[1,1],[1,2],[2,0]],
                        [[0,0],[1,0],[2,0],[2,1]],
                        [[0,2],[1,0],[1,1],[1,2]]
        ];
        this.color = "#2141c6";
    }
}
class Block7 extends Block {
    constructor () {
        super();
        this.shape = [
                        [[0,0],[0,1],[1,1],[1,0]],
                        [[0,0],[0,1],[1,1],[1,0]],
                        [[0,0],[0,1],[1,1],[1,0]],
                        [[0,0],[0,1],[1,1],[1,0]]
        ];
        this.color = "#e39f02";
    }
}
class Field {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.field = create2DArray(width, height);
    }
    color = "#808080";

    deleteLine(line) {
        console.log("work %d", line);
        for(var i=1; i<this.width+1; i++){
            for(var j=line; j>0; j--){
                this.field[j][i] = this.field[j-1][i]; 
            }

        }
    }

    drawField(x, y) {
        ctx.beginPath();
        ctx.rect(x*px,y*px,this.width*px, this.height*px);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
        for(var i=0; i<this.height; i++){
            for(var j=0; j<this.width; j++){
                if(this.field[i+2][j+1] == 1){
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
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.fieldA = new Field(width, height);
        this.ran = [];
        this.ran.push(Math.floor(Math.random()*7)+1);
        this.ran.push(Math.floor(Math.random()*7)+1);
        this.ran.push(Math.floor(Math.random()*7)+1);
        this.ran.push(Math.floor(Math.random()*7)+1);
        this.currentBlock = randomBlock(this.ran.shift());
        this.ran.push(Math.floor(Math.random()*7)+1);
    }

    draw (){
        this.fieldA.drawField(this.x,this.y);
        this.currentBlock.drawBlock(this.x,this.y);
    }
    createBlock () {
        this.currentBlock = randomBlock(this.ran.shift());
        this.ran.push(Math.floor(Math.random()*7)+1);
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
                    count = 0;
                    break;
                }
                console.log("move back");
                this.currentBlock.moveBlock(-1);

                count++;
            }
            while(this.collision()) {
                console.log("work?");
                if(count == 2){
                    this.currentBlock.x  = pos.x;
                    this.currentBlock.y  = pos.y;
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
            this.createBlock();
            this.cheakDelete();

        }
    }
    checkGameOver () {
        for(var i = 1; i<11; i++){
            if(this.fieldA.field[10][i] === 1){
                console.log(gamePlaying);
                this.draw();
                gamePlayer(2);
                
            }
        }
    }
    cheakDelete() {
        console.log("check");
        var check = 0;
        for(var i=0; i<this.fieldA.height; i++){
            for(var j=0; j<this.fieldA.width; j++){
                if(this.fieldA.field[i+2][j+1] === 1){
                    check++;
                    console.log(check);
                }
            }
            if(check == 10){
                this.fieldA.deleteLine(i+2);
            }
            check = 0;
        }
        
    }
}

var game;
var control =0;
var gamePlaying = undefined;
function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.control(control);
    game.land();
    game.draw();

    game.checkGameOver();

    control = 0;
    gamePlaying = requestAnimationFrame(main);
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


function gamePlayer (key) {
    var btn = document.getElementById("start");
    if(key == 1){
        console.log("start");
        game = new Control(0, 0, 10, 20);
        main();
        btn.setAttribute("disable", "disable");
    }
    else if(key == 2){
        console.log("gamePlay2");
        btn.disable = true;
    }
}

