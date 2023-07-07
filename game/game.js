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

//--------------------------------------------------------------------------
// Logical Glogals

// arrray of board blocks, search by ID, not by index
let board = [];
// array of snakes
let snakes = [];
// array of ladders
let ladders = [];
// boundaries of board once more things are added
let boardBounds = {}

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
  
  // draw ladders on board
  // draw board visually
    drawBoard();
  // draw numbers on board
  drawLadders();
  
  drawNumbers();
  // draw snakes on board
  drawSnakes();
  
  
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
        // generate tail location
        let t = Math.round(random(25, 50));
        let tail;
        if (h - t > 1){
            tail = getBlockByID(h-t);
        }
        else{
            tail = getBlockByID(Math.round(random(2,6)));
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
        let t = Math.round(random(20, 99));
        let top = getBlockByID(t);
        // generate tail location
        let b = Math.round(random(25, 50));
        let bottom;
        if (t - b > 1){
            bottom = getBlockByID(t-b);
        }
        else{
            bottom = getBlockByID(Math.round(random(2,6)));
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
        rect((i * cutX), (j * cutY), cutX, cutY);
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
        'row': ladder.top.y_coord,
        'col': ladder.top.x_coord,

        'upper_left': {
            'x': ladder.top.xpos - width / 20,
            'y': ladder.top.ypos - height / 20
        },

        'upper_right': {
            'x': ladder.top.xpos + width / 20,
            'y': ladder.top.ypos - height / 20
        },

        'lower_left': {
            'x': ladder.top.xpos - width / 20,
            'y': ladder.top.ypos + width / 20
        },

        'lower_right': {
            'x': ladder.top.xpos + width / 20,
            'y': ladder.top.ypos + width / 20
        },

        'mid_left': {
            'x': ladder.top.xpos - width / 20,
            'y': ladder.top.ypos
        },

        'mid_right': {
            'x': ladder.top.xpos + width / 20,
            'y': ladder.top.ypos
        }
    }

    let ladder_bottom_cell = {
        'row': ladder.bottom.y_coord,
        'col': ladder.bottom.x_coord,

        'upper_left': {
            'x': ladder.bottom.xpos - width / 20,
            'y': ladder.bottom.ypos - height / 20
        },

        'upper_right': {
            'x': ladder.bottom.xpos + width / 20,
            'y': ladder.bottom.ypos - height / 20
        },

        'lower_left': {
            'x': ladder.bottom.xpos - width / 20,
            'y': ladder.bottom.ypos + width / 20
        },

        'lower_right': {
            'x': ladder.bottom.xpos + width / 20,
            'y': ladder.bottom.ypos + width / 20
        },

        'mid_left': {
            'x': ladder.bottom.xpos - width / 20,
            'y': ladder.bottom.ypos
        },

        'mid_right': {
            'x': ladder.bottom.xpos + width / 20,
            'y': ladder.bottom.ypos
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