// import file to be tested
let tests = require("./game/gameEngine");

// assert function similar to ones found in many other languages
// condition: boolean value or expression to be tested
// upon failure of condition, an Error will be thrown
// message: error message to be displayed upon failure of condition
function assert (condition, message){
    if(!condition){
        throw new Error(message);
    }
}

// test for player movement from one spot to another, not for testing overflow
// start is the desired starting location of the player
// die is the die roll value to be tested
// tests if the ending location of the plaeyr is equal to start + die
function test_movePlayer_basic(start, die){
    tests.players[0].playerPosition = start;
    let end = start + die;
    if(end > 100){
        throw new Error("ERROR: Invalid position and/or die value passed to test_movePlayer_basic.");
    }
    for(snk of tests.snakes){
        if (end == snk.head){
            end = snk.tail;
        }
    }
    for (ldr of tests.ladders){
        if (end == ldr.bottom){
            end = ldr.top;
        }
    }
    tests.movePlayer(tests.players[0], die);
    assert((tests.players[0].playerPosition == end), 
        "ERROR: Function movePlayer set incorrect position. Expected position was " + end + ", returned position was " + tests.players[0].playerPosition);
  
}

// test for player movement on the boundary of the win condition
// player location should not exceed 100 unless an exact roll occurs
function test_movePlayer_overflow(){
    tests.players[0].playerPosition = 99;
    tests.movePlayer(tests.players[0], 3);
    assert((tests.players[0].playerPosition == 99),
        "ERROR: Function movePlayer set incorrect position. Expected position was 99, returned position was " + tests.players[0].playerPosition);
}

// test for player landing on head of snake
// player location should be updated to be at the tail of snake after movement
function test_movePlayer_snake(){
    let head = tests.snakes[1].head;
    let tail = tests.snakes[1].tail;
    let start = head - 3;
    tests.players[0].playerPosition = start;
    tests.movePlayer(tests.players[0], 3);
    assert((tests.players[0].playerPosition == tail),
        "ERROR: Player started at position " + start + " and landed on snake head at position " + head + ", expected position was "
        + tail + ", actual position is " + tests.players[0].playerPosition);
}

// test for player landing on bottom of ladder
// player location should be updated to be at the top of the ladder
function test_movePlayer_ladder(){
    let bottom = tests.ladders[1].bottom;
    let top = tests.ladders[1].top;
    let start = bottom - 2;
    tests.players[1].playerPosition = start;
    tests.movePlayer(tests.players[1], 2);
    assert((tests.players[1].playerPosition == top),
        "ERROR: Player started at position " + start + " and landed at the top of a ladder at position " + bottom + ", expected position was "
        + top +", actual position is " + tests.players[1].playerPosition);
}

// test for overlapping endpoints
// there should be no snakes or ladders that end on the same spot
function test_overlap(){
    for(snk of tests.snakes){
        for (ldr of tests.ladders){
            assert((snk.head != snk.tail && snk.head != ldr.top && snk.tail != ldr.top && snk.head != ldr.bottom && snk.tail != ldr.bottom && ldr.top != ldr.bottom),
                "ERROR: Overlap between snake/ladder endpoints detected.");
        }
    }
}

// test for win condition
// test moves player to winning position (100),
// then checks that that player is returned as the winner
function test_win(){
    tests.players[0].playerPosition = 99;
    tests.movePlayer(tests.players[0], 1);
    assert((tests.players[0].playerPosition == 100), "ERROR: Player position expected to be 100, actual was" + tests.players[0].playerPosition);
    assert((tests.players[0].hasWon == true), "ERROR: Player is expected to be marked as winner, but hasWon field returns FALSE");
    assert((tests.players[0] == tests.getWinningPlayer()));
}

// tests that the range of numbers from rollDieAndGetValue are from 1 to 6
// this is a brute force test that since it is very hard to show this definitively in a test
// this is best tested by manual inspection of the code
async function test_dieValues(){
    let value;
    for (let i = 0; i < 1000; i++){
        value = await tests.dieValue();
        assert((value>= 1 && value <= 6),
            "ERROR: Value returned from roll of die was not between 1 and 6. Value returned was: " + value);
    }
}
// tests setting and retrieving the player location
function test_playerPosition(player, location){
    tests.players[player - 1].playerPosition = location;
    switch(player){
        case 1:
            assert(tests.players[player - 1].playerPosition == location, 
                "ERROR: Player position incorrect, expected: " + location + ", actual: " + tests.players[player - 1].playerPosition);
            assert(tests.players[player - 1].id == "player1",
                "ERROR: Player ID incorrect, expected: player1, actual: " + tests.players[player - 1].id);
            break;
        case 2:
            assert(tests.players[player - 1].playerPosition == location, 
                "ERROR: Player position incorrect, expected: " + location + ", actual: " + tests.players[player - 1].playerPosition);
            assert(tests.players[player - 1].id == "player2",
                "ERROR: Player ID incorrect, expected: player2, actual: " + tests.players[player - 1].id);
            break;
        default:
            throw new Error("ERROR: Invalid arguament: Player " + player + " does not exist.")
    }
}

console.log("Testing movePlayer with basic movement...");
test_movePlayer_basic(0, 5);
console.log("Testing movePlayer with basic movement...");
test_movePlayer_basic(10, 2);
console.log("Testing movePlayer for overflow handling...");
test_movePlayer_overflow();
console.log("Testing movePlayer for encountering snake...");
test_movePlayer_snake();
console.log("Testsing movePlayer for encountering ladder...");
test_movePlayer_ladder();
console.log("Testing for overlap of snake/ladder endpoints...");
test_overlap();
console.log("Testing player win conditions...");
test_win();
console.log("Testing player data structure for player 1...");
test_playerPosition(1, 43);
console.log("Testing player data structure for player 2...");
test_playerPosition(2, 21);
console.log("Testing die roll...");
test_dieValues();
console.log("pass.");