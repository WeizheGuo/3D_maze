var oC2 = document.getElementById('c2d');
var ctx = oC2.getContext('2d');


var width = oC2.width;
var height = oC2.height;
var maxX = 36;
var maxY = 26;

var firstGrid;
var endGrid;

function Grid(x, y) {
    this.x = x;
    this.y = y;
    this.isClear = false;
    this.choosed = false;
    this.initNeighbor();

    this.nextX = 0;
    this.nextY = 0;
}

Grid.prototype.initNeighbor = function() {
    var x = this.x;
    var y = this.y;

    this.neighbor = [];

    if(y > 0) {
        this.neighbor.push({
        x: x,
        y: y - 2
        });
    }

    if(y < maxY) {
        this.neighbor.push({
            x: x,
            y: y + 2
        });
    }

    if(x > 0) {
        this.neighbor.push({
        x: x - 2,
        y: y 
        });
    }

    if(x < maxX) {
        this.neighbor.push({
        x: x + 2,
        y: y
        });
    }

    this.neighbor.sort(function() {
        return 0.5 - Math.random();
    });
};

Grid.prototype.getNeighbor = function() {
    var x, y, neighbor, ret = [];

    this.choosed = true;

    for(var i = 0; i < this.neighbor.length; i++) {
        x = this.neighbor[i].x;
        y = this.neighbor[i].y;

        neighbor = maze.grids[y][x];

        neighbor.wallX = this.x + (x - this.x)/2;
        neighbor.wallY = this.y + (y - this.y)/2;

        if(!neighbor.choosed) {
            ret.push(neighbor);
        }
    }

    return ret;
};

function Maze() {
    this.path = [];
    this.grids = [];
    this.stack = [];

    this.walls = [];

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
    endGrid = this.grids[26][36];
};

Maze.prototype.findPath = function() {
    var tmp;
    var curr = firstGrid;
    var index;
    var walls = this.walls;

    tmp = curr.getNeighbor();

    curr.isClear = true;

    walls.push.apply(walls, tmp);

    while(walls.length) {
        index = (Math.random() * walls.length) >> 0;

        wall = walls[index];

        if(!wall.isClear) {
            wall.isClear = true;

            this.path.push({
                x: wall.wallX,
                y: wall.wallY
            });

            tmp = wall.getNeighbor();

            walls.push.apply(walls, tmp);
        } else {
            walls.splice(index, 1);
        }
    }

    // console.log('路径找寻结束', this.path);
};

Maze.prototype.drawPath = function() {
    var i;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, oC2.width, oC2.height);

    ctx.fillStyle = 'black';

    for(i = 0; i <= 290; i+=20) {
        ctx.fillRect(0, i, 390, 10);
    }

    for(i = 0; i <= 390; i+=20) {
        ctx.fillRect(i, 0, 10, 290);
    }

    ctx.fillStyle = 'white';

    for(i = 0; i < this.path.length; i++) {
        ctx.fillRect(10 + this.path[i].x * 10, 10 + this.path[i].y * 10, 10, 10);
    }
};

var maze = new Maze();

maze.findPath();

maze.drawPath();

drawStartEnd();

function drawStartEnd() {
    ctx.fillRect(0, 10, 10, 10);
    ctx.fillRect(19 * 20, 13 * 20 + 10, 10, 10);
}

function drawDebug(x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, 1, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}


/**        绘制2D底图结束，开始获取墙面信息           **/

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
                x1 = j; // 记录横墙开始点
                
                j += 10;
                while(isBlack(j, i) && j < width) {
                    j += 10;
                }

                x2 = j; // 记录横墙结束点
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

    console.log(rowWall.length);
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
                y1 = j; // 记录竖墙开始点
                
                j += 10;
                while(isBlack(i, j) && j < height) {
                    j += 10;
                }

                y2 = j; // 记录竖墙结束点
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