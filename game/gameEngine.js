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

class player{
    constructor(id, name, position, hasWon) {
        this.id = id;
        this.name = name;
        this.playerPosition = position;
        this.hasWon = hasWon
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
// set of endpoints of ladders and snakes to prevent duplicates
let endpoints = new Set();
// boundaries of board once more things are added
let boardBounds = {}

let oldP1Position = 1;
let oldP2Position = 1;

let lastRoll;

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

function rand(min, max){
	return Math.random() * (max - min) + min;
}

// generates the heads, tails, and bodies of snakes
function genSnakes(){
    for (let i = 0; i < 5; i++){
        // generate head location
        let h = Math.round(rand(20, 99));
        // let head = getBlockByID(h);
        endpoints.add(h);
        while(endpoints.size < 1 + i * 2){
            h -= 1;
            // head = getBlockByID(h);
            endpoints.add(h);
        }
        // generate tail location
        let t = Math.round(rand(25, 50));
        let tail;
        if (h - t > 2){
            // tail = getBlockByID(h-t);
			tail = h - t;
            endpoints.add(tail);
            while(endpoints.size < 2 + i * 2){
                t -= 1;
                tail = h - t; //getBlockByID(h - t);
                endpoints.add(tail);
            }
        }
        else{
            tail = (Math.round(rand(2,5))); //getBlockByID(Math.round(random(2,5)));
            endpoints.add(tail);
            while(endpoints.size < 2 + i * 2){
                tail = Math.round(rand(2,5)); //getBlockByID(Math.round(random(2, 5)));
                endpoints.add(tail);
            }
        }
        // connect head to tail

        // color
        let color = [];
        for(let i = 0; i < 3; i++){
            color.push(Math.round(rand(0,255)));
        }
        //add to snakes
        let snk = new snake(h, 0, tail, new rgb(color[0], color[1], color[2]));
        snakes.push(snk);
    }
}

// generates the tops, bottoms, and rungs for the ladders
function genLadders(){
    for (let i = 0; i < 5; i++){
        // generate head location
        let top;
        let t;
        t = Math.round(rand(20, 99));
        //top = getBlockByID(t);
        endpoints.add(t);
        while(endpoints.size < 11 + i * 2){
            t -= 1;
            //top = getBlockByID(t);
            endpoints.add(t);
        }
        // generate tail location
        let b; 
        let bottom;
        b = Math.round(rand(25, 50));
        if (t - b > 6){
            bottom = t - b; // getBlockByID(t - b);
            endpoints.add(bottom);
            while (endpoints.size < 12 + i * 2){
                b -= 1;
                bottom = t - b; //getBlockByID(t - b);
                endpoints.add(bottom);
            }
        }
        else{
            bottom = (Math.round(rand(6, 10)));
            endpoints.add(bottom);
            while(endpoints.size < 12 + i * 2){
                bottom = (Math.round(rand(6, 10)));
                endpoints.add(bottom);
            }
        }
        // connect head to tail

        // color
        let color = [];
        for(let i = 0; i < 3; i++){
            color.push(Math.round(rand(0,255)));
        }

        //add to snakes
        let ldr = new ladder(t, 0, bottom, new rgb(color[0], color[1], color[2]));
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
function drawNumbers() {
    strokeWeight(0.5);
    fill(10);
    for(block of board){
        text(block.id, block.xpos, block.ypos);
    }
}
  
var currentPlayerIndex = 0;
let players = [];
let playerNamesEntered = false;

function playersInit() {
    for (let i = 0; i < 2; i++){
        players.push(new player (`player${i+1}`, `P${i+1}`, 1, false));
    }
}

const GameMode = 
{
    AUTOMATIC: '0',
    SEMI_AUTOMATIC: '1',
    MANUAL: '2',
}
var gameMode = GameMode.MANUAL;

function waitForUserClick() {
    return new Promise(resolve => {
        const roll_die_button = document.getElementById('roll_die_button');
        roll_die_button.classList.add('ative-button');
        roll_die_button.addEventListener('click', resolve, { once: true });
    });
}

async function startPlay()
{
    if (gameMode != GameMode.AUTOMATIC) {
        document.getElementById('roll_die_button').style.display = 'block';
    }

	let currentPlayerIndex = 0;
    var currentPlayer;
	while(!isGameOver()) {
		currentPlayer = players[currentPlayerIndex];
		let diceValue = 0;
        if ((gameMode == GameMode.SEMI_AUTOMATIC && currentPlayerIndex == 1) || gameMode == GameMode.MANUAL) {
            await waitForUserClick();
        }
        const roll_die_button = document.getElementById('roll_die_button');
        roll_die_button.classList.remove('ative-button');
        diceValue = await rollDieAndGetValue();
		document.getElementById("rolledValue").innerHTML =  "<b>" + diceValue +  "</b>";
        randomizeDice(diceValue);
        lastRoll = diceValue;
        let waiting = await haultFlow();
        if(currentPlayerIndex == 0) {
            oldP1Position = currentPlayer.playerPosition;
        }
        if(currentPlayerIndex == 1) {
            oldP2Position = currentPlayer.playerPosition;
        }
		movePlayer(currentPlayer, diceValue);
        document.getElementById(currentPlayer.id + "_pos").innerHTML = "<b>" + currentPlayer.playerPosition + "</b>";
		currentPlayerIndex = (currentPlayerIndex+1)%(players.length);
        await haultFlow();
        console.log(currentPlayerIndex);
	}
	
	let winningPlayer = getWinningPlayer();
	
	let message = " Congratulations, " + winningPlayer.name + " won the game!";
    if (confirm("Game Over!\n" + message)) {
        window.location.reload(true);
    } else {
        window.location.reload(true);
    }
}


async function haultFlow() {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve((true));
        }, 1000);
      });
}

function movePlayer(currentPlayer, diceValue) {
	let playerPosition = currentPlayer.playerPosition;
	playerPosition = playerPosition + diceValue;
	if (playerPosition > 100) {
		playerPosition = currentPlayer.playerPosition;
	}
	else {
		movePlayerOnBoard(currentPlayer, diceValue);
		checkIfPlayerhasWonAndUpdate(currentPlayer);
	}
}

function checkIfPlayerhasWonAndUpdate(currentPlayer) {
	if (currentPlayer.playerPosition === 100) {
		currentPlayer.hasWon = true;
	}
}

function movePlayerOnBoard(currentPlayer, diceValue) {
	for (let i = 0; i < diceValue; i++) {
		currentPlayer.playerPosition++;
		//MovePlayer asynchronously with delay on board
	}
	currentPlayer.playerPosition = checkIfPlayersPositionHasSnakeHeadAndGetNewPosition(currentPlayer.playerPosition);
	currentPlayer.playerPosition = checkIfPlayersPositionHasLadderBottomAndGetNewPosition(currentPlayer.playerPosition);
	//MovePlayer asynchronously with delay on board
}

function checkIfPlayersPositionHasLadderBottomAndGetNewPosition(playerPosition) {
	for (let i = 0; i < ladders.length; i++) {
		if (ladders[i].bottom == playerPosition) {
			playerPosition = ladders[i].top;
		}
	}
	
	return playerPosition;
}

function checkIfPlayersPositionHasSnakeHeadAndGetNewPosition(playerPosition) {
	for (let i = 0; i < snakes.length; i++) {
		if (snakes[i].head == playerPosition) {
			playerPosition = snakes[i].tail;
		}
	}
	
	return playerPosition;
}

async function rollDieAndGetValue() {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(dieValue());
        }, 1000);
      });
}
function dieValue(){
    return (Math.floor(Math.random() * 6) + 1);
}
function getWinningPlayer() {
	for (let i = 0; i < players.length; i++) {
		if (players[i].hasWon) {
			return players[i];
		}
	}
}
	
function isGameOver() {
	for (let i = 0; i < players.length; i++) {
		if (players[i].hasWon) {
			return true;
		}
	}
	
	return false;
}
//----------------------------------------------------------------------------------
// Initialization Functions

// initialize locations of snakes
genSnakes();
// initialize locations of ladders
genLadders();

playersInit();

//----------------------------------------------------------------------------------
// Testing Exports

module.exports = {
    players, 
    movePlayer, 
    snakes,
    ladders,
    getWinningPlayer,
    checkIfPlayerhasWonAndUpdate,
    dieValue
};
