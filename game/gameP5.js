function setup() {
}

function getPlayerNames(event) {
    var ele = document.getElementsByName('gameMode');
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            gameMode = ele[i].value;
    }
  playersHeading = document.getElementById('players-heading')
  document.getElementById('game-modes').remove();
  playersHeading.innerText = "Enter players names";
  switch(gameMode) {
    case(GameMode.AUTOMATIC): {
        button = document.getElementById('submit-button');
        button.setAttribute('onClick', 'drawAnimations()');
        drawAnimations();
    }
    case(GameMode.SEMI_AUTOMATIC): {
        document.getElementById('player1').classList.remove('hide');
        break;
    }
    case(GameMode.MANUAL): {
        document.getElementById('player1').classList.remove('hide');
        document.getElementById('player2').classList.remove('hide');
        break;
    }
  }
  button = document.getElementById('submit-button');
  button.setAttribute('onClick', 'drawAnimations()');
}



function drawAnimations() {
    createCanvas(500, 500); 
    // initialize board logically
    genBoard();
    //genLadders(); 
    genLadderMidPoints();
    genSnakeMidPoints();
    playerNamesEntered = true;
    playersHeading.remove();
    button.remove();
    players = [];
    switch(gameMode){
        case (GameMode.AUTOMATIC):
            players.push(new player('player1', "Red", 1, false));
            players.push(new player('player2', "Blue", 1, false));
            break;
        case (GameMode.SEMI_AUTOMATIC):
            players.push(new player('player1', "Computer", 1, false));
            players.push(new player('player2', document.getElementById('player1').value, 1, false));
            break;
        case (GameMode.MANUAL):
            players.push(new player('player1', document.getElementById('player1').value, 1, false));
            players.push(new player('player2', document.getElementById('player2').value, 1, false));
            break;
        default:
            break;
    }
    document.getElementById('player-inputs').remove();
    document.getElementsByClassName("control-center")[0].style.display = "flex";
    displayPlayerNames();
    startPlay();
}

function displayPlayerNames() {
    document.getElementById("player1_name").innerText = players[0].name;
    document.getElementById("player2_name").innerText = players[1].name;
    document.getElementById("player1_pos").inputText = players[0].playerPosition;
    document.getElementById("player2_pos").innerText = players[1].playerPosition;
}

let p1Path = [];
let p2Path = [];

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
    //drawPlayers();
    if (players[0].playerPosition != oldP1Position){
        let path = (genPathFromRoll(players[0], oldP1Position, lastRoll));
        p1Path = path.reverse();
        oldP1Position = players[0].playerPosition;
    }
    if (p1Path.length > 0){
        drawPlayer1Moving(p1Path.pop());
    }
    else{
        drawPlayer1Static(getBlockByID(players[0].playerPosition));
    }
    if (players[1].playerPosition != oldP2Position){
        let path = (genPathFromRoll(players[1], oldP2Position, lastRoll));
        p2Path = path.reverse();
        oldP2Position = players[1].playerPosition;
    }
    if (p2Path.length > 0){
        drawPlayer2Moving(p2Path.pop());
    }
    else{
        drawPlayer2Static(getBlockByID(players[1].playerPosition));
    }
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
  // Midpoint Generation

  // generates array of midpoints for ladders that player follows on animation
  function genLadderMidPoints(){
    for (let ldr of ladders){
        let top = getBlockByID(ldr.top);
        let btm = getBlockByID(ldr.bottom);
        ldr.rungs = linearMap(btm.xpos, btm.ypos, top.xpos, top.ypos);
    }
  }

 

  function getSnakeDrawPoints(snake) {
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
    head_coords = {
        'x': (snake_head_cell.mid_left.x + snake_head_cell.mid_right.x) / 2,
        'y': (snake_head_cell.mid_left.y + snake_head_cell.mid_right.y) / 2
    }
    
    tail_coords = {
        'x':  (snake_tail_cell.mid_left.x + snake_tail_cell.mid_right.x) / 2,
        'y': (snake_tail_cell.mid_left.y + snake_tail_cell.mid_right.y) / 2
    }
    
    first_point = {
        'x': head_coords.x + ((tail_coords.x - head_coords.x) * 1 / 3),
        'y': head_coords.y + ((tail_coords.y - head_coords.y) * 1 / 3)
    }

    second_point = {
        'x': head_coords.x + ((tail_coords.x - head_coords.x) * 2 / 3),
        'y': head_coords.y + ((tail_coords.y - head_coords.y) * 2 / 3)
    }

    snake_vector = {
        'x': (tail_coords.x - head_coords.x),
        'y': (tail_coords.y - head_coords.y)
    }

    // Normalize.
    snake_vector_value = dist(snake_vector.x, snake_vector.y, 0, 0);

    snake_vector = {
        'x': snake_vector.x / snake_vector_value,
        'y': snake_vector.y / snake_vector_value
    }

    snake_vector_normal = {
        'x': 1,
        'y': -(snake_vector.x / snake_vector.y)
    }

    snake_vector_normal2 = {
        'x': -1,
        'y': (snake_vector.x / snake_vector.y)
    }

    snake_vector_normal_value = dist(snake_vector_normal.x, snake_vector_normal.y, 0, 0);
    snake_vector_normal = {
        'x': snake_vector_normal.x / snake_vector_normal_value,
        'y': snake_vector_normal.y / snake_vector_normal_value
    }
    
    snake_vector_normal2_value = dist(snake_vector_normal2.x, snake_vector_normal2.y, 0, 0);
    snake_vector_normal2 = {
        'x': snake_vector_normal2.x / snake_vector_normal2_value,
        'y': snake_vector_normal2.y / snake_vector_normal2_value
    }
    //console.log(snake_vector_normal2)

    first_anchor = {
        'x': first_point.x  + (snake_vector_normal.x * 0.5 * snake_vector_value),
        'y': first_point.y  + (snake_vector_normal.y * 0.5 * snake_vector_value)
    }

    second_anchor = {
        'x': second_point.x - snake_vector_normal.x * 0.5 * snake_vector_value,
        'y': second_point.y - snake_vector_normal.y * 0.5 * snake_vector_value
        // 'x': (width  + 10) / 2, 'y': (height + 10) / 2
    }
    
    

    return {
        'first_anchor': first_anchor,
        'second_anchor': second_anchor,
        'head_coords': head_coords,
        'tail_coords': tail_coords
    }
  }

  function genSingleSnakeMidPoints(snk) {
    //strokeWeight(10);

    snk_points = getSnakeDrawPoints(snk)

    let ret = []
    for(let i = 0; i < 35; i++) {
        let t = i / 35

        ret.push({x: bezierPoint(snk_points.head_coords.x, 
                                snk_points.first_anchor.x, 
                                snk_points.second_anchor.x, snk_points.tail_coords.x, t),
                                y: bezierPoint(snk_points.head_coords.y, 
                                    snk_points.first_anchor.y, 
                                    snk_points.second_anchor.y, snk_points.tail_coords.y, t)});
    }
    console.log('returned')
    return ret
    // bezier(head_1_coords.x, head_1_coords.y, first_anchor.x, first_anchor.y, second_anchor.x, second_anchor.y, tail_coords.x,  tail_coords.y);
  }

  function genSnakeMidPoints() {
    for (let snk of snakes) {
        // let top = getBlockByID(snk.top);
        // let btm = getBlockByID(snk.bottom);

        snk.body = genSingleSnakeMidPoints(snk);
    }
  }
  // generates array of points between two endpoints
  function linearMap(x1, y1, x2, y2){
    if (x1 == x2){
        let ret = [];
        let splitY = (y1 - y2) / 35;
        for (let i = 34; i >= 0; i--){
            ret.push({x: x2, y: y2 + splitY * i});
        }
        return ret;
    }
    let m = (y2 - y1) / (x2 - x1);
    let b = y2 - (m * x2);
    let ret = [];
    let splitX = (x2 - x1) / 35;
    for (let i = 0; i < 35; i++){
        ret.push({x: x1 + splitX * i, y: m * (x1 + splitX * i) + b});
    }
    ret.push({x: x2, y: y2});
    return ret;
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
    head_coords = {
        'x': (snake_head_cell.mid_left.x + snake_head_cell.mid_right.x) / 2,
        'y': (snake_head_cell.mid_left.y + snake_head_cell.mid_right.y) / 2
    }
    
    tail_coords = {
        'x':  (snake_tail_cell.mid_left.x + snake_tail_cell.mid_right.x) / 2,
        'y': (snake_tail_cell.mid_left.y + snake_tail_cell.mid_right.y) / 2
    }
    
    first_point = {
        'x': head_coords.x + ((tail_coords.x - head_coords.x) * 1 / 3),
        'y': head_coords.y + ((tail_coords.y - head_coords.y) * 1 / 3)
    }

    second_point = {
        'x': head_coords.x + ((tail_coords.x - head_coords.x) * 2 / 3),
        'y': head_coords.y + ((tail_coords.y - head_coords.y) * 2 / 3)
    }

    snake_vector = {
        'x': (tail_coords.x - head_coords.x),
        'y': (tail_coords.y - head_coords.y)
    }

    // Normalize.
    snake_vector_value = dist(snake_vector.x, snake_vector.y, 0, 0);

    snake_vector = {
        'x': snake_vector.x / snake_vector_value,
        'y': snake_vector.y / snake_vector_value
    }

    snake_vector_normal = {
        'x': 1,
        'y': -(snake_vector.x / snake_vector.y)
    }

    snake_vector_normal2 = {
        'x': -1,
        'y': (snake_vector.x / snake_vector.y)
    }

    snake_vector_normal_value = dist(snake_vector_normal.x, snake_vector_normal.y, 0, 0);
    snake_vector_normal = {
        'x': snake_vector_normal.x / snake_vector_normal_value,
        'y': snake_vector_normal.y / snake_vector_normal_value
    }
    
    snake_vector_normal2_value = dist(snake_vector_normal2.x, snake_vector_normal2.y, 0, 0);
    snake_vector_normal2 = {
        'x': snake_vector_normal2.x / snake_vector_normal2_value,
        'y': snake_vector_normal2.y / snake_vector_normal2_value
    }
    //console.log(snake_vector_normal2)

    first_anchor = {
        'x': first_point.x  + (snake_vector_normal.x * 0.5 * snake_vector_value),
        'y': first_point.y  + (snake_vector_normal.y * 0.5 * snake_vector_value)
    }

    second_anchor = {
        'x': second_point.x - snake_vector_normal.x * 0.5 * snake_vector_value,
        'y': second_point.y - snake_vector_normal.y * 0.5 * snake_vector_value
        // 'x': (width  + 10) / 2, 'y': (height + 10) / 2
    }
    //console.log(first_anchor);
    //console.log(second_anchor);
    strokeWeight(10);
    bezier(head_coords.x, head_coords.y, first_anchor.x, first_anchor.y, second_anchor.x, second_anchor.y, tail_coords.x,  tail_coords.y);
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

function genPathFromRoll(player, oldPosition, roll){
    let path = [];
    let oldPos = getBlockByID(oldPosition);
    let diePos = getBlockByID(oldPosition + roll);
   
    let i = 1;
    while(i <= roll){
        let nextPos = getBlockByID(oldPosition + i);
        let distX = (nextPos.xpos - oldPos.xpos) / 10;
        let distY = (nextPos.ypos - oldPos.ypos) / 10;
        for (let j = 0; j < 10; j ++){
            if(nextPos.xpos < oldPos.xpos){
                path.push({x:nextPos.xpos - (10 - j) * distX, y:oldPos.ypos});
            }
            else if(nextPos.xpos > oldPos.xpos){
                path.push({x:oldPos.xpos + j * distX, y:oldPos.ypos});
            }
            else if(nextPos.ypos < oldPos.ypos){
                path.push({x:oldPos.xpos, y:oldPos.ypos + j * distY});
            }
            else if(nextPos.ypos > oldPos.ypos){
                path.push({x:oldPos.xpos, y:nextPos.ypos - (10 - j) * distY});
            }
        }
        oldPos = nextPos;
        i++;
    }
    for (let ldr of ladders){
        if (ldr.bottom == diePos.id){
            for (let i = 0; i < 35; i++){
                path.push({x: diePos.xpos, y: diePos.ypos});
            }
            for (let i = 0; i < ldr.rungs.length; i++){
                path.push(ldr.rungs[i]);
            }
        }
    }

    for (let snk of snakes){
        // console.log(ldr.bottom);
        if (snk.head == diePos.id){
            for (let i = 0; i < 35; i++){
                path.push({x: diePos.xpos, y: diePos.ypos});
            }
            print(snk.body)
            for (let i = 0; i < snk.body.length; i++){
                path.push(snk.body[i]);
            }
        }
    }
    return path;
}

function drawPlayer1Static(pos){
    fill(255, 0, 0);
    star(pos.xpos, pos.ypos, 20, 10, 5);
}

function drawPlayer2Static(pos){
    fill(0, 0, 255);
    star(pos.xpos, pos.ypos, 10, 20, 5);
}

function drawPlayer1Moving(path){
    fill(255, 0, 0);
    star(path.x, path.y, 20, 10, 5);
}

function drawPlayer2Moving(path){
    fill(0, 0, 255);
    star(path.x, path.y, 10, 20, 5);
}