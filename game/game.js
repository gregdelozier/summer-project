//--------------------------------------------------------------------
// Class Definintions

// class to store the ID, logical location, and physical center of
// each block that makes up the board
class boardBlock{
    constructor(i, xp, yp, x_coord, y_coord){
        this.id = i;
        this.xpos = xp;
        this.ypos = yp;
        this.x = x_coord;
        this.y = y_coord;
    }
}

class player{
    constructor(id, name, position) {
        this.id = id;
        this.name = name;
        this.position = position;
    }
}
// uses boardBlocks to represent head, tail
// body is an array of boardBlocks
// clr is an rgb color
class snake{
    constructor(h, b, t, clr){
        this.head = h;
        this.body = b;
        this.tail = t;
        this.color = clr;
    }
}


// uses boardBlocks to represent top, bottom
// rung is an array of boardBlocks
// clr is an rgb color
class ladder{
    constructor(t, r, b, clr){
        this.top = t;
        this.rungs = r;
        this.bottom = b;
        this.color = clr;
    }
}

// red, green, blue color
class rgb{
    constructor(r, g, b){
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}

//--------------------------------------------------------------------------
// Logical Glogals

// arrray of board blocks, search by ID, not by index
let board = [];
// array of snakes
let snakes = [];
// array of ladders
let ladders = [];
let players = [];

// set of endpoints of ladders and snakes to prevent duplicates
let endpoints = new Set();
// boundaries of board once more things are added
let boardBounds = {}

let playerNamesEntered = false;

//----------------------------------------------------------------------------
// Engine Functions

// searches the array of blocks for the one with matching ID
function getBlockByID(i){
    for(block of board){
        if(block.id == i){
            return(block);
        }
    }
}

function setup() {
    numberOfPlayers = createInput();
    numberOfPlayers.position(20, 65);
    playersHeading = createElement('h2', 'Enter number of players');
    playersHeading.position(20, 5);
    button = createButton('submit');
    button.position(numberOfPlayers.x + numberOfPlayers.width, 65);
    button.mousePressed(getPlayerNames);
    textAlign(CENTER);
    textSize(50);
}

function getPlayerNames() {
  playersHeading.html('Enter player names');
  const playerCount = numberOfPlayers.value();
  numberOfPlayers.remove();
  playerNames = []
  for(let i=0; i<parseInt(playerCount); i++) {
    playerNames[i] = createInput();
    playerNames[i].position(40, 100 + (i*40));
  }
  button.position(40, (parseInt(playerCount) * 100));
  button.mousePressed(drawAnimations);
}

function drawAnimations() {
    createCanvas(750, 750); 
    // initialize board logically
    genBoard();
    // initialize locations of snakes
    genSnakes();
    // initialize locations of ladders
    genLadders(); 
    playerNamesEntered = true;
    playersHeading.remove();
    button.remove();
    for(i=0; i< playerNames.length; i++) {
        players.push(new player(i+1, playerNames[i].value(), 0));
        playerNames[i].remove();
    }
    displayPlayerNames();
}

function displayPlayerNames() {
    playersHeading = createElement('h2', 'Names of players');
    playersHeading.position(1000, 100);
    playersList = []
    for(i=0;i<players.length;i++){
        playersList[i] = createElement('h3', players[i].name);
        playersList[i].position(1000, ((i+1) * 50) + 120)
    }
}

function draw() {
  if(playerNamesEntered > 0) {
    background(220);
    // draw board visually
    drawBoard();
    // draw numbers on board
    drawNumbers();
    // draw snakes on board
    drawSnakes();
    // draw ladders on board
    drawLadders();
  }
}

// maps a logical coordinate to its on board coordinate
function mapCoordToNum(x, y){
  if(x % 2){
    return (x + 1) * 10 - y + 1;
  }
  else {
    return x * 10 + y;
  }
}

// generates the logical view and phyical view of the board
function genBoard(){
    for (let i = 0; i < 10; i ++){
        for (let j = 0; j < 10; j ++){
            let piece;
            let id = mapCoordToNum(j, i + 1);
            let x_coord = i;
            let y_coord = j;
            let xpos =  0 + width/10 * i + width / 20;
            let ypos = height - (height/10  * j) - height / 20;
            piece = new boardBlock(id, xpos, ypos, x_coord, y_coord);
            board.push(piece);
        }
    }
}

// generates the heads, tails, and bodies of snakes
function genSnakes(){
    for (let i = 0; i < 5; i++){
        // generate head location
        let h = Math.round(random(20, 99));
        let head = getBlockByID(h);
        endpoints.add(head);
        while(endpoints.size < 1 + i * 2){
            h -= 1;
            head = getBlockByID(h);
            endpoints.add(head);
        }
        // generate tail location
        let t = Math.round(random(25, 50));
        let tail;
        if (h - t > 2){
            tail = getBlockByID(h-t);
            endpoints.add(tail);
            while(endpoints.size < 2 + i * 2){
                t -= 1;
                tail = getBlockByID(h - t);
                endpoints.add(tail);
            }
        }
        else{
            tail = getBlockByID(Math.round(random(2,5)));
            endpoints.add(tail);
            while(endpoints.size < 2 + i * 2){
                tail = getBlockByID(Math.round(random(2, 5)));
                endpoints.add(tail);
            }
        }
        // connect head to tail

        // color
        let color = [];
        for(let i = 0; i < 3; i++){
            color.push(Math.round(random(0,255)));
        }
        //add to snakes
        let snk = new snake(head, 0, tail, new rgb(color[0], color[1], color[2]));
        snakes.push(snk);
    }
}

// generates the tops, bottoms, and rungs for the ladders
function genLadders(){
    for (let i = 0; i < 5; i++){
        // generate head location
        let top;
        let t;
        t = Math.round(random(20, 99));
        top = getBlockByID(t);
        endpoints.add(top);
        while(endpoints.size < 11 + i * 2){
            t -= 1;
            top = getBlockByID(t);
            endpoints.add(top);
        }
        console.log(endpoints.size);
        // generate tail location
        let b; 
        let bottom;
        b = Math.round(random(25, 50));
        if (t - b > 6){
            bottom = getBlockByID(t - b);
            endpoints.add(bottom);
            while (endpoints.size < 12 + i * 2){
                b -= 1;
                bottom = getBlockByID(t - b);
                endpoints.add(bottom);
            }
        }
        else{
            bottom = getBlockByID(Math.round(random(6, 10)));
            endpoints.add(bottom);
            while(endpoints.size < 12 + i * 2){
                bottom = getBlockByID(Math.round(random(6, 10)));
                endpoints.add(bottom);
            }
        }
        // connect head to tail

        // color
        let color = [];
        for(let i = 0; i < 3; i++){
            color.push(Math.round(random(0,255)));
        }

        //add to snakes
        let ldr = new ladder(top, 0, bottom, new rgb(color[0], color[1], color[2]));
        ladders.push(ldr);
    }
}

//----------------------------------------------------------------------------------------
// Drawing Functions

// draws the squares for the board on the screen
function drawBoard(){
    stroke(40);
    fill(255);
    let cutX = width / 10;
    let cutY = height / 10
    let x = width - cutX;
    let y = height - cutY;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        strokeWeight(4);
        rect(i * cutX, j * cutY, cutX, cutY);
      }
    }
  }

// draws the correct numbers on the board tiles
function drawNumbers(){
    strokeWeight(0.5);
    fill(10);
    for(block of board){
        text(block.id, block.xpos, block.ypos);
    }
}
  
// draws the snakes
function drawSnakes(){
    for(snk of snakes){
        fill(snk.color.red, snk.color.green, snk.color.blue);
        circle(snk.head.xpos, snk.head.ypos, 20);
        circle(snk.tail.xpos, snk.tail.ypos, 20);
    }
}

// draws the ladders
function drawLadders(){
    for(ldr of ladders){
        fill(ldr.color.red, ldr.color.green, ldr.color.blue);
        rect(ldr.top.xpos, ldr.top.ypos, 20);
        rect(ldr.bottom.xpos, ldr.bottom.ypos, 20);
    }
}
