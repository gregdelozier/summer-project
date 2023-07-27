function setup() {
  playersHeading = createElement('h2', 'Enter player names');
  playersHeading.position(20, 5);
  const playerCount = 2
  playerNames = []
  for(let i=0; i<parseInt(playerCount); i++) {
    playerNames[i] = createInput();
    playerNames[i].position(40, 100 + (i*40));
  }
  button = createButton('submit');
  button.position(40, (parseInt(playerCount) * 100));
  button.mousePressed(drawAnimations);
}

function drawAnimations() {
    createCanvas(500, 500); 
    // initialize board logically
    genBoard();
    // initialize locations of snakes
    // genSnakes();
    // initialize locations of ladders
    genLadders(); 
    playerNamesEntered = true;
    playersHeading.remove();
    button.remove();
    startPlay();
    for(i=0; i< playerNames.length; i++) {
        players.push(new player(i+1, playerNames[i].value(), 1, false));
        playerNames[i].remove();
    }
    displayPlayerNames();
}

function displayPlayerNames() {
    playersHeading = createElement('h2', 'Names of players');
    playersHeading.position(550, 100);
    playersList = []
    for(i=0;i<players.length;i++){
        playersList[i] = createElement('h3', `Player ${i+1} : `+players[i].name);
        playersList[i].position(550, ((i+1) * 50) + 120)
    }
}

function draw() {
  if(playerNamesEntered) {
    background(220);
    // draw board visually
    drawBoard();
    // draw numbers on board
    drawNumbers();
    // draw snakes on board
    drawSnakes();
    // draw ladders on board
    drawLadders();
    drawPlayers();
  }
}
//----------------------------------------------------------------------------------------------
// Board Generation

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
        //   fill(snk.color.red, snk.color.green, snk.color.blue);
        //   circle(getBlockByID(snk.head).xpos, getBlockByID(snk.head).ypos, 20);
        //   circle(getBlockByID(snk.tail).xpos, getBlockByID(snk.tail).ypos, 20);
        drawSingleSnake(snk);
      }
  }
  
  // draws the ladders
  function drawLadders(){
  
    for(ldr of ladders){
        // fill(ldr.color.red, ldr.color.green, ldr.color.blue);
        // let x = ldr.top.
        // rect(ldr.top.xpos, ldr.top.ypos + 10, 20);
        // rect(ldr.bottom.xpos, ldr.bottom.ypos, 20);
  
        let color = [];
        for(let i = 0; i < 3; i++){
            color.push(Math.round(random(0,255)));
        }
        drawSingleLadder(ldr, color)
    }
  }
  
  function intersect_point(point1, point2, point3, point4) {
    const ua = ((point4[0] - point3[0]) * (point1[1] - point3[1]) - 
              (point4[1] - point3[1]) * (point1[0] - point3[0])) /
             ((point4[1] - point3[1]) * (point2[0] - point1[0]) - 
              (point4[0] - point3[0]) * (point2[1] - point1[1]));
   
   const ub = ((point2[0] - point1[0]) * (point1[1] - point3[1]) - 
              (point2[1] - point1[1]) * (point1[0] - point3[0])) /
             ((point4[1] - point3[1]) * (point2[0] - point1[0]) - 
              (point4[0] - point3[0]) * (point2[1] - point1[1]));
   
   const x = point1[0] + ua * (point2[0] - point1[0]);
   const y = point1[1] + ua * (point2[1] - point1[1]);
   
   return [x, y]
  }
  
  
  function drawSingleLadder(ladder, color) {
    // Four corners of the ladder's top
    let ladder_top_cell = {
        'row': getBlockByID(ladder.top).y_coord,
        'col': getBlockByID(ladder.top).x_coord,
  
        'upper_left': {
            'x': getBlockByID(ladder.top).xpos - width / 20,
            'y': getBlockByID(ladder.top).ypos - height / 20
        },
  
        'upper_right': {
            'x': getBlockByID(ladder.top).xpos + width / 20,
            'y': getBlockByID(ladder.top).ypos - height / 20
        },
  
        'lower_left': {
            'x': getBlockByID(ladder.top).xpos - width / 20,
            'y': getBlockByID(ladder.top).ypos + width / 20
        },
  
        'lower_right': {
            'x': getBlockByID(ladder.top).xpos + width / 20,
            'y': getBlockByID(ladder.top).ypos + width / 20
        },
  
        'mid_left': {
            'x': getBlockByID(ladder.top).xpos - width / 20,
            'y': getBlockByID(ladder.top).ypos
        },
  
        'mid_right': {
            'x': getBlockByID(ladder.top).xpos + width / 20,
            'y': getBlockByID(ladder.top).ypos
        }
    }
  
    let ladder_bottom_cell = {
        'row': getBlockByID(ladder.bottom).y_coord,
        'col': getBlockByID(ladder.bottom).x_coord,
  
        'upper_left': {
            'x': getBlockByID(ladder.bottom).xpos - width / 20,
            'y': getBlockByID(ladder.bottom).ypos - height / 20
        },
  
        'upper_right': {
            'x': getBlockByID(ladder.bottom).xpos + width / 20,
            'y': getBlockByID(ladder.bottom).ypos - height / 20
        },
  
        'lower_left': {
            'x': getBlockByID(ladder.bottom).xpos - width / 20,
            'y': getBlockByID(ladder.bottom).ypos + width / 20
        },
  
        'lower_right': {
            'x': getBlockByID(ladder.bottom).xpos + width / 20,
            'y': getBlockByID(ladder.bottom).ypos + width / 20
        },
  
        'mid_left': {
            'x': getBlockByID(ladder.bottom).xpos - width / 20,
            'y': getBlockByID(ladder.bottom).ypos
        },
  
        'mid_right': {
            'x': getBlockByID(ladder.bottom).xpos + width / 20,
            'y': getBlockByID(ladder.bottom).ypos
        }
    
    }
    strokeWeight(2);
    stroke([ladder.color.red, ladder.color.green, ladder.color.blue])
    
    line(ladder_top_cell.mid_left.x, ladder_top_cell.mid_left.y, 
            ladder_bottom_cell.mid_left.x, ladder_bottom_cell.mid_left.y);
  
    line(ladder_top_cell.mid_right.x, ladder_top_cell.mid_right.y, 
        ladder_bottom_cell.mid_right.x, ladder_bottom_cell.mid_right.y)  
    
  
    for(var i = ladder_top_cell.mid_left.y + 10; i < ladder_bottom_cell.mid_left.y; i += 15) {
        
        // Line 1
        // (0, i), (width, i)
        // Line 2
        horizontal_point1 = [0, i];
        horizontal_point2 = [width, i];
  
        ladder_line1_pt = [
            [ladder_top_cell.mid_left.x, ladder_top_cell.mid_left.y],
            [ladder_bottom_cell.mid_left.x, ladder_bottom_cell.mid_left.y]
        ];
        
        ladder_line2_pt = [
            [ladder_top_cell.mid_right.x, ladder_top_cell.mid_right.y],
            [ladder_bottom_cell.mid_right.x, ladder_bottom_cell.mid_right.y]
        ];
  
        pt1 = intersect_point(horizontal_point1, horizontal_point2, ladder_line1_pt[0], ladder_line1_pt[1]);
        pt2 = intersect_point(horizontal_point1, horizontal_point2, ladder_line2_pt[0], ladder_line2_pt[1]);
  
  
        stroke([ladder.color.red, ladder.color.green, ladder.color.blue])
        line(pt1[0], pt1[1], 
            pt2[0], pt2[1]);
  
  
    }
  
  }


  
//draws a single snake
function drawSingleSnake(snake) {
    // Four corners of the ladder's top
    let snake_head_cell = {
        'row': getBlockByID(snake.head).y_coord,
        'col': getBlockByID(snake.head).x_coord,
    
        'upper_left': {
            'x': getBlockByID(snake.head).xpos - width / 20,
            'y': getBlockByID(snake.head).ypos - height / 20
        },
    
        'upper_right': {
            'x': getBlockByID(snake.head).xpos + width / 20,
            'y': getBlockByID(snake.head).ypos - height / 20
        },
    
        'lower_left': {
            'x': getBlockByID(snake.head).xpos - width / 20,
            'y': getBlockByID(snake.head).ypos + width / 20
        },
    
        'lower_right': {
            'x': getBlockByID(snake.head).xpos + width / 20,
            'y': getBlockByID(snake.head).ypos + width / 20
        },
    
        'mid_left': {
            'x': getBlockByID(snake.head).xpos - width / 20,
            'y': getBlockByID(snake.head).ypos
        },
    
        'mid_right': {
            'x': getBlockByID(snake.head).xpos + width / 20,
            'y': getBlockByID(snake.head).ypos
        }
    }
      
    let snake_tail_cell = {
        'row': getBlockByID(snake.tail).y_coord,
        'col': getBlockByID(snake.tail).x_coord,
    
        'upper_left': {
            'x': getBlockByID(snake.tail).xpos - width / 20,
            'y': getBlockByID(snake.tail).ypos - height / 20
        },
    
        'upper_right': {
            'x': getBlockByID(snake.tail).xpos + width / 20,
            'y': getBlockByID(snake.tail).ypos - height / 20
        },
    
        'lower_left': {
            'x': getBlockByID(snake.tail).xpos - width / 20,
            'y': getBlockByID(snake.tail).ypos + width / 20
        },
    
        'lower_right': {
            'x': getBlockByID(snake.tail).xpos + width / 20,
            'y': getBlockByID(snake.tail).ypos + width / 20
        },
    
        'mid_left': {
            'x': getBlockByID(snake.tail).xpos - width / 20,
            'y': getBlockByID(snake.tail).ypos
        },
    
        'mid_right': {
            'x': getBlockByID(snake.tail).xpos + width / 20,
            'y': getBlockByID(snake.tail).ypos
        }
    
    }
    noFill()
    
    stroke([snake.color.red, snake.color.green, snake.color.blue])
    // Snake endpoints
    // console.log((snake_tail_cell.mid_left.x + snake_tail_cell.mid_right.x) / 2)
    head_1_coords = {
        'x': (snake_head_cell.mid_left.x + snake_head_cell.mid_right.x) / 2,
        'y': (snake_head_cell.mid_left.y + snake_head_cell.mid_right.y) / 2
    }
    head_2_coords = {
        'x': snake_head_cell.mid_right.x - 10,
        'y': snake_head_cell.mid_right.y
    }

    tail_coords = {
        'x':  (snake_tail_cell.mid_left.x + snake_tail_cell.mid_right.x) / 2,
        'y': (snake_tail_cell.mid_left.y + snake_tail_cell.mid_right.y) / 2
    }
    
    head_tail_vector = {
        'x': tail_coords.x - head_1_coords.x,
        'y': tail_coords.y - head_1_coords.y
    }

    head_tail_per_vector = {
        'x': -head_tail_vector.x,
        'y': head_tail_vector.y
    }

    first_anchor = {
        // 'x': (tail_coords.x - head_1_coords.x) * 1 / 4  + head_tail_per_vector.x * 3,
        // 'y': (tail_coords.y - head_1_coords.y) * 1 / 4  + head_tail_per_vector.y * 3
        'x': (width) / 2, 'y' : (height) / 2
    }

    second_anchor = {
        // 'x': (tail_coords.x - head_1_coords.x) * 3 / 4 - head_tail_per_vector.x * 3,
        // 'y': (tail_coords.y - head_1_coords.y) * 3 / 4 - head_tail_per_vector.y * 3,
        'x': (width  + 10) / 2, 'y': (height + 10) / 2
    }
    strokeWeight(10);
    bezier(head_1_coords.x, head_1_coords.y, first_anchor.x, first_anchor.y, second_anchor.x, second_anchor.y, tail_coords.x,  tail_coords.y);
    // bezier(head_2_coords.x, head_2_coords.y, first_anchor.x + 10, first_anchor.y, second_anchor.x, second_anchor.y, tail_coords.x,  tail_coords.y);

}


  



function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawPlayers(){
    // console.log(players);
    if(oldP1Position < players[0].playerPosition)
        oldP1Position += 1;
    if(oldP1Position > players[0].playerPosition)
        oldP1Position -= 1;
    drawPlayer1(getBlockByID(oldP1Position));
    if(oldP2Position < players[1].playerPosition)
        oldP2Position += 1;
    if(oldP2Position > players[1].playerPosition)
        oldP2Position -= 1;
    drawPlayer2(getBlockByID(oldP2Position));
}

function drawPlayer1(pos){
    fill(255, 0, 0);
    star(pos.xpos, pos.ypos, 20, 10, 5);
}

function drawPlayer2(pos){
    fill(0, 0, 255);
    star(pos.xpos, pos.ypos, 10, 20, 5);
}