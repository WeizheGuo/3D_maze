var oC2 = document.getElementById('c2d');
var ctx = oC2.getContext('2d');
var width = oC2.width;
var height = oC2.height;
var maxX = 13;
var maxY = 8;
var firstGrid;
var endGrid;
function Grid(x, y) {
    this.x = x;
    this.y = y;
    this.choosed = false;
    this.children = [];
    this.initNeighbor();
}
Grid.prototype.initNeighbor = function() {
    var x = this.x;
    var y = this.y;
    this.neighbor = [];
    if(y > 0) {
        this.neighbor.push({
           x: x,
           y: y - 1 
        });
    }
    if(y < maxY) {
        this.neighbor.push({
            x: x,
            y: y + 1
        });
    }
    if(x > 0) {
        this.neighbor.push({
           x: x - 1,
           y: y 
        });
    }
    if(x < maxX) {
        this.neighbor.push({
           x: x + 1,
           y: y
        });
    }
    this.neighbor.sort(function() {
        return 0.5 - Math.random();
    });
};
Grid.prototype.getNeighbor = function() {
    var x, y, neighbor;
    this.choosed = true;
    for(var i = 0; i < this.neighbor.length; i++) {
        x = this.neighbor[i].x;
        y = this.neighbor[i].y;
        neighbor = maze.grids[y][x];
        if(!neighbor.choosed) {
            neighbor.parent = this;
            return neighbor;
        }
    }
    if(this.parent === firstGrid) {
        return 0;
    } else {
        return 1;
    }
};
function Maze() {
    this.path = [];
    this.grids = [];
    this.stack = [];
    this.init();
}
Maze.prototype.init = function() {
    for(var i = 0; i <= maxY; i++) {
        this.grids[i] = [];
        for(var j = 0; j <= maxX; j++) {
            this.grids[i][j] = new Grid(j, i);
        }
    }
    firstGrid = this.grids[0][0];
    endGrid = this.grids[8][13];
};
Maze.prototype.findPath = function() {
    var tmp;
    var curr = firstGrid;
    while(1) {
        tmp = curr.getNeighbor();
        if(tmp === 0) {
            //console.log('finish path finding');
            break;
        } else if(tmp === 1) {
            curr = curr.parent;
        } else {
            curr.children[curr.children.length] = tmp;
            curr = tmp;
        }
    }
};

function drawPath(node) {;
    var i = 0;
    drawRect(node.x * 20, node.y * 20);
    for(; i < node.children.length; i++) {
        if(node.children[i]) {
            drawRect(node.x * 20 + (node.children[i].x - node.x) * 10, node.y * 20 + (node.children[i].y - node.y) * 10); // 画路
            drawPath(node.children[i]);
        }
    }
}
function drawRect(x, y) {
    ctx.fillRect(x + 10, y + 10, 10, 10);
}
function drawDebug(x, y, color) {
    // return ;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, 1, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = 'grey';
var maze = new Maze();
maze.findPath();
drawPath(firstGrid);
drawStartEnd();

function drawStartEnd() {
    ctx.fillRect(0, 10, 10, 10);
    ctx.fillRect(14 * 20, 8 * 20 + 10, 10, 10);
    setTimeout(function() {
        // role.hide();
    }, 3000);
}

// finishing drawing 2d maze, getting wall info now
var rowWall = [];
var colWall = [];
var pixData;
getWall();
function getWall() {
    pixData = ctx.getImageData(0, 0, width, height).data;
    getRowWall();
    getColWall();
}
function getRowWall() {
    var i = 0;
    var j = 0;
    var x1, x2;
    console.log('getRowWall');
    for(; i < height; i += 10) {
        rowWall[i] = [];
        j = 0;
        while(j < width) {
            if(isBlack(j, i)) {
                x1 = j; // store the start pos of row wall
                
                j += 10;
                while(isBlack(j, i) && j < width) {
                    j += 10;
                }
                x2 = j; // store the end pos of row wall
                if((x2 - x1) > 10) {
                    rowWall[i].push({
                        x1: 2 * (x1 / width) - 1,
                        x2: 2 * (x2 / width) - 1
                    });
                }
            }
            j += 10;
        }
    }
}
function getColWall() {
    var i = 0;
    var j = 0;
    var y1, y2;
    console.log('getRowWall');
    for(; i < width; i += 10) {
        colWall[i] = [];
        j = 0;
        while(j < height) {
            if(isBlack(i, j)) {
                y1 = j; // store the start pos of column wall
                
                j += 10;
                while(isBlack(i, j) && j < height) {
                    j += 10;
                }
                y2 = j; // store the end pos of column wall
                if((y2 - y1) > 10) {
                    colWall[i].push({
                        y1: 2 * (y1 / height) - 1,
                        y2: 2 * (y2 / height) - 1
                    });
                }
            }
            j += 10;
        }
    }
    // console.log(colWall);
}
function getPix(x, y) {
    var start = y * width * 4 + x * 4;
    var r = pixData[start];
    var g = pixData[start + 1];
    var b = pixData[start + 2];
    var a = pixData[start + 3];
    return [r, g, b, a];
}
function isBlack(x, y) {
    x += 1;
    y += 1;
    var start = y * width * 4 + x * 4;
    var r = pixData[start];
    if(r === 0) {
        return true;
    } else {
        return false;
    }
}
/*function isWall(x, y, cx, cy) {
    var start, r;
    var retX = true,
        retY = true;
    x += ((1 * cx) >> 0);
    if(x > 0 && y > 0) {
        start = y * width * 4 + x * 4;
        r = pixData[start];
        if(r === 0) {
            drawDebug(x, y, 'yellow');
            retX = false;
        }
    }
    x -= (1 * cx);
    y += (1 * cy);
    if(y > 0 && x > 0) {
        start = y * width * 4 + x * 4;
        r = pixData[start];
        if(r === 0) {
            drawDebug(x, y, 'yellow');
            retY = false;
        }
    }
    
    return {
        x: retX,
        y: retY
    };
}*/