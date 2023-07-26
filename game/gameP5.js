function setup() {
    createCanvas(750, 750); 
    // initialize board logically
    genBoard();
    // initialize locations of snakes
    genSnakes();
    // initialize locations of ladders
    genLadders();
}

function draw() {
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
          fill(snk.color.red, snk.color.green, snk.color.blue);
          circle(getBlockByID(snk.head).xpos, getBlockByID(snk.head).ypos, 20);
          circle(getBlockByID(snk.tail).xpos, getBlockByID(snk.tail).ypos, 20);
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
  