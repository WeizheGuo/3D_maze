var oC3 = document.getElementById('c3d');
var webgl = oC3.getContext('webgl');

var vsScript = document.getElementById('shader-vs').innerText;
var fsScript = document.getElementById('shader-fs').innerText;

var vs = webgl.createShader(webgl.VERTEX_SHADER);
var fs = webgl.createShader(webgl.FRAGMENT_SHADER);

webgl.shaderSource(vs, vsScript);
webgl.shaderSource(fs, fsScript);

webgl.compileShader(vs);
if(!webgl.getShaderParameter(vs, webgl.COMPILE_STATUS)) {
    alert('vs error');
}
webgl.compileShader(fs);
if(!webgl.getShaderParameter(fs, webgl.COMPILE_STATUS)) {
    alert('fs error');
}

var program = webgl.createProgram();

webgl.attachShader(program, vs);
webgl.attachShader(program, fs);

webgl.linkProgram(program);
webgl.useProgram(program);

var aVertex = webgl.getAttribLocation(program, 'aVertex');
var nVertex = webgl.getAttribLocation(program, 'aVertexNormal')
var aColor = webgl.getAttribLocation(program, 'aColor');
var aMp = webgl.getAttribLocation(program, 'aMp');
var uPMatrix = webgl.getUniformLocation(program, 'uPMatrix');
var uMVMatrix = webgl.getUniformLocation(program, 'uMVMatrix');
var uCRMatrix = webgl.getUniformLocation(program, 'uCRMatrix');
var uCMVMatrix = webgl.getUniformLocation(program, 'uCMVMatrix');
var uTex = webgl.getUniformLocation(program, 'uTex');
var isMaze = webgl.getUniformLocation(program, 'isMaze');

program.lightDirection = webgl.getUniformLocation(program, 'lightDirection');
webgl.uniform3fv(program.lightDirection, normalize([-1.0, 1.5, 2.0]));

function normalize(a){
	var sum = 0;
	for(var i=0;i<a.length;i++){
		sum+=Math.abs(a[i]);
	}
	outArr = [];
	for(var i=0;i<a.length;i++){
		outArr.push(a[i]/sum);
	}
	
	return outArr;
}

// program.ambi = webgl.getUniformLocation(program, "uAmbient");
// webgl.uniform1f(program.ambi, 0.2);

webgl.enableVertexAttribArray(aVertex);
webgl.enableVertexAttribArray(nVertex);
webgl.disableVertexAttribArray(aColor);
webgl.enableVertexAttribArray(aMp);

var po_data = [];
var index_data = [];
var mp_data = [];
var item, tmp;
var s = 0;
var k;
var count = 0;

// new edit here
var pn_data = [];

var ground = Object.create(null);
po_data = [
    -20, -1.1, 20,
    20, -1.1, 20,
    20, -1.1, -20,
    -20,-1.1,-20
];

pn_data = [
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0
]

index_data = [0, 1, 2, 2, 3, 0];

ground.poBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, ground.poBuf);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(po_data), webgl.STATIC_DRAW);
//new
ground.pnBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, ground.pnBuf);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(pn_data), webgl.STATIC_DRAW);

ground.indexBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ground.indexBuf);
webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_data), webgl.STATIC_DRAW);

po_data = [];
index_data = [];
pn_data = [];

var k;

// k1和k2算作Z轴
for(i = 0; i < rowWall.length; i += 10) { // rowWall.length
    item = rowWall[i];
    while((tmp = item.pop())) {
        k1 = (2 * i / height) - 1;
        k2 = (2 * (i + 10) / height) - 1;
        po_data.push.apply(po_data, [
            tmp.x1*120+0.01, -1.09, k1*120, // 左下
            tmp.x2*120+0.01, -1.09, k1*120, // 右下
            tmp.x2*120+0.01, 0.2, k1*120, // 右上
            tmp.x1*120+0.01, 0.2, k1*120, // 左上

            tmp.x2*120+0.01, -1.09, k1*120,
            tmp.x2*120+0.01, -1.09, k2*120,
            tmp.x2*120+0.01, 0.2, k2*120,
            tmp.x2*120+0.01, 0.2, k1*120,

            tmp.x1*120+0.01, -1.09, k2*120,
            tmp.x2*120+0.01, -1.09, k2*120,
            tmp.x2*120+0.01, 0.2, k2*120,
            tmp.x1*120+0.01, 0.2, k2*120,

            tmp.x1*120+0.01, -1.09, k1*120,
            tmp.x1*120+0.01, -1.09, k2*120,
            tmp.x1*120+0.01, 0.2, k2*120,
            tmp.x1*120+0.01, 0.2, k1*120,

            tmp.x1*120+0.01, 0.2, k1*120,
            tmp.x2*120+0.01, 0.2, k1*120,
            tmp.x2*120+0.01, 0.2, k2*120,
            tmp.x1*120+0.01, 0.2, k1*120
        ]);
        // new here
        pn_data.push.apply(pn_data,[
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
        ]);

        count += (6*5);

        for(k = 0; k < 5; k++) {
            index_data.push(s, s+1, s+2, s+2, s+3, s);
            s += 4;
        }

        mp_data.push.apply(mp_data, [
            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0,

            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0,

            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0,

            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0,

            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0
        ]);
    }
}

maze.row = Object.create(null);
maze.row.count = count;

maze.row.poBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.row.poBuf);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(po_data), webgl.STATIC_DRAW);

// new edit
maze.row.pnBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.row.pnBuf);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(pn_data), webgl.STATIC_DRAW);

maze.row.mpBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.row.mpBuf);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(mp_data), webgl.STATIC_DRAW);

maze.row.indexBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, maze.row.indexBuf);
webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_data), webgl.STATIC_DRAW);

s = 0;
count = 0;
po_data = [];

pn_data = [];

mp_data = [];
index_data = [];

// k1和k2算作X轴
for(i = 0; i < colWall.length; i += 10) {
    item = colWall[i];
    while((tmp = item.pop())) {
        k1 = 2 * (i / width) - 1;
        k2 = 2 * ((i + 10) / width) - 1;
        po_data.push.apply(po_data, [
            k1*120, -1.09, tmp.y1*120+0.01, // 前下
            k1*120, -1.09, tmp.y2*120+0.01, // 后下
            k1*120, 0.2, tmp.y2*120+0.01, // 后上
            k1*120, 0.2, tmp.y1*120+0.01, // 前上

            k1*120, -1.09, tmp.y1*120+0.01,
            k2*120, -1.09, tmp.y1*120+0.01,
            k2*120, 0.2, tmp.y1*120+0.01,
            k1*120, 0.2, tmp.y1*120+0.01,

            k2*120, -1.09, tmp.y1*120+0.01,
            k2*120, -1.09, tmp.y2*120+0.01,
            k2*120, 0.2, tmp.y2*120+0.01,
            k2*120, 0.2, tmp.y1*120+0.01,

            k1*120, -1.09, tmp.y2*120+0.01,
            k2*120, -1.09, tmp.y2*120+0.01,
            k2*120, 0.2, tmp.y2*120+0.01,
            k1*120, 0.2, tmp.y2*120+0.01,

            k1*120, 0.2, tmp.y1*120+0.01,
            k1*120, 0.2, tmp.y2*120+0.01,
            k2*120, 0.2, tmp.y2*120+0.01,
            k2*120, 0.2, tmp.y1*120+0.01
        ]);

        pn_data.push.apply(pn_data,[
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
        ]);

        count += (6*5);
        // count += (6);

        for(k = 0; k < 5; k++) {
            index_data.push(s, s+1, s+2, s+2, s+3, s);
            s += 4;
        }

        mp_data.push.apply(mp_data, [
            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0,

            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0,

            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0,

            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0,

            2.0, 0.0,
            2.0, 2.0,
            0.0, 2.0,
            0.0, 0.0
        ]);
    }
}

maze.col = Object.create(null);
maze.col.count = count;

maze.col.poBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.col.poBuf);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(po_data), webgl.STATIC_DRAW);

// new edit
maze.col.pnBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.col.pnBuf);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(pn_data), webgl.STATIC_DRAW);

maze.col.mpBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.col.mpBuf);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(mp_data), webgl.STATIC_DRAW);

maze.col.indexBuf = webgl.createBuffer();

webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, maze.col.indexBuf);
webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_data), webgl.STATIC_DRAW);

webgl.uniformMatrix4fv(
    uPMatrix, false, (function(a, r, n, f){
        a = 1 / Math.tan(a * Math.PI / 360);
        
        return [
            a/r, 0, 0, 0,
            0, a, 0, 0,
            0, 0, -(f+n)/(f-n), -1,
            0, 0, -2*f*n/(f-n), 0
        ];
    })(90, c2d.width/c2d.height, 0.1, 100)
);

webgl.enable(webgl.DEPTH_TEST);

var imgRow = new Image();
var imgCol = new Image();

imgRow.onload = function() {
    maze.row.texture = webgl.createTexture();
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, maze.row.texture);
    webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);

    webgl.texImage2D(
        webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, imgRow
    );

    webgl.generateMipmap(webgl.TEXTURE_2D);

    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);

    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.MIRRORED_REPEAT);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.MIRRORED_REPEAT);

    webgl.uniform1i(uTex, 0);

    webgl.bindTexture(webgl.TEXTURE_2D, null);

    imgRow.loaded = true;

    if(imgCol.loaded) {
        setInterval(function() {
            draw(a);
        }, 16);
    }
};
imgCol.onload = function() {
    maze.col.texture = webgl.createTexture();
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, maze.col.texture);
    webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true);

    webgl.texImage2D(
        webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, imgCol
    );

    webgl.generateMipmap(webgl.TEXTURE_2D);

    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);

    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.MIRRORED_REPEAT);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.MIRRORED_REPEAT);

    webgl.uniform1i(uTex, 0);

    webgl.bindTexture(webgl.TEXTURE_2D, null);

    imgCol.loaded = true;

    if(imgRow.loaded) {
        setInterval(function() {
            draw(a);
        }, 16);
    }
};

imgRow.src = './plaster.jpg';
imgCol.src = './wood.jpg';

webgl.enable(webgl.DEPTH_TEST);

var a = Math.PI / 2;

function draw(a) {
    if(KEYS[UP])
        camera.move(0.2);
    if(KEYS[DOWN])
        camera.move(-0.2);

    // 绘制地板
    drawGround();

    // 绘制迷宫
    drawMaze(a);
}

function drawMaze(a) {
    var s = Math.sin(a);
    var c = Math.cos(a);

    webgl.uniformMatrix4fv(
        uMVMatrix, false, [1 * c,0,-1 * s,0, 0,5,0,0, 1 * s,0,1 * c,0, 0,0,-120.5,1]
    );

    webgl.uniformMatrix4fv(
        uCMVMatrix, false, camera.toMatrix()
    );

    webgl.uniformMatrix4fv(
        uCRMatrix, false, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]
    );

    webgl.uniform1i(isMaze, true);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.row.poBuf);
    webgl.vertexAttribPointer(aVertex, 3, webgl.FLOAT, false, 0, 0);
    // new here
    webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.row.pnBuf);
    webgl.vertexAttribPointer(nVertex, 3, webgl.FLOAT, false, 0, 0);


    webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.row.mpBuf);
    webgl.vertexAttribPointer(aMp, 2, webgl.FLOAT, false, 0, 0);
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, maze.row.texture);

    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, maze.row.indexBuf);

    webgl.drawElements(webgl.TRIANGLES, maze.row.count, webgl.UNSIGNED_SHORT, 0);



    webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.col.poBuf);
    webgl.vertexAttribPointer(aVertex, 3, webgl.FLOAT, false, 0, 0);
    // new here
    webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.col.pnBuf);
    webgl.vertexAttribPointer(nVertex, 3, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, maze.col.mpBuf);
    webgl.vertexAttribPointer(aMp, 2, webgl.FLOAT, false, 0, 0);
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, maze.col.texture);

    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, maze.col.indexBuf);

    webgl.drawElements(webgl.TRIANGLES, maze.col.count, webgl.UNSIGNED_SHORT, 0);
}

function drawGround() {
    webgl.vertexAttrib3f(aColor, 0.8, 0.8, 0.8);

    webgl.uniformMatrix4fv(
        uMVMatrix, false, [15,0,0,0, 0,5,0,0, 0,0,15,0, 0,0,-100,1]
    );

    webgl.uniformMatrix4fv(
        uCMVMatrix, false, camera.toMatrix()
    );

    webgl.uniformMatrix4fv(
        uCRMatrix, false, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]
    );

    webgl.uniform1i(isMaze, false);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, ground.poBuf);
    webgl.vertexAttribPointer(aVertex, 3, webgl.FLOAT, false, 0, 0);
    // new here
    webgl.bindBuffer(webgl.ARRAY_BUFFER, ground.pnBuf);
    webgl.vertexAttribPointer(nVertex, 3, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ground.indexBuf);

    webgl.drawElements(webgl.TRIANGLES, 6, webgl.UNSIGNED_SHORT, 0);
}

/**        绘制3D迷宫完毕，摄像头处理           **/

var cx, cy, ret;

var globalRot = window.innerWidth / 2;
var camera = {
    rot: 0,
    x: 0,
    y: 0,
    z: 0,
    move: function(e){
        // 移动时需要做朝向计算
        cx = Math.sin(-this.rot) * e;
        cy = Math.cos(-this.rot) * e;


        this.x += cx;
        this.z += cy;

        ret = role.check(-this.x/120, this.z/242, -cx, cy); // 后两个参数代表方向

        if(ret.x === 0) {
            this.x -= cx;
        } else {
            role.x = ret.x;
        }

        if(ret.y === 0) {
            this.z -= cy;
        } else {
            role.y = ret.y;
        }

        role.update();
    },
    toMatrix: function(){
        var s = Math.sin(this.rot),
            c = Math.cos(this.rot),
            x = this.x,
            z = this.z;

        // 无Y轴相关变化
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0, 
            c * x + s * z, 1, c * z - s * x, 1
        ];
    }
};


var LEFT = 37,
    UP = 87,
    RIGHT = 39,
    DOWN = 83,
    KEYS = {};

var cheats = [65, 76, 76, 79, 89, 84, 69, 65, 77];
var isInCheats = false;

document.onkeydown = function(e) {
    /*if(e.keyCode === 13) {
        if(isInCheats) {
            closeCheats();
        } else {
            console.log('开始输入秘籍');
            doCheats();
        }

        return ;
    }*/
    KEYS[e.keyCode] = true;
};
document.onkeyup = function(e) {
    KEYS[e.keyCode] = false;
};

document.onmousemove = function(e) {
    var x = e.clientX;

    if(e.clientX <= 2) {
        camera.rot += -0.05;
    } else if(e.clientX >= window.innerWidth - 2) {
        camera.rot += 0.05;
    } else {
        camera.rot += ((x - globalRot) / 100);
    }

    
    globalRot = x;
};

// function doCheats() {
//     var div = document.getElementById('cheatWrap');
//     div.style.transform = 'translateY(0)';

//     var cheat = document.getElementById('cheat');
//     cheat.focus();

//     isInCheats = true;
// }

// function closeCheats() {
//     var div = document.getElementById('cheatWrap');
//     div.style.transform = 'translateY(0)';

//     var cheat = document.getElementById('cheat');

//     if(cheat.value.toLowerCase() === 'alloyteam') {
//         console.log('开启秘籍');
//         role.show();
//         document.body.removeChild(div);
//     } else {
//         console.log('密令错误');
//         cheat.value = '';
//         cheat.blur();
//         div.style.transform = 'translateY(150%)';
//     }

//     isInCheats = false;
// }

function Role() {
    this.main = document.createElement('div');
    this.main.className = 'role';

    this.diffTop = oC2.offsetTop;
    this.diffLeft = oC2.offsetLeft;
    this.disX = oC2.offsetHeight;
    this.disY = oC2.offsetWidth + 1;

    this.x = 95;
    this.y = -1;


    document.body.appendChild(this.main);
}

Role.prototype.update = function(x, y) {
    this.x0 = this.x - 1;
    this.x2 = this.x + 1;

    this.y0 = this.y - 1;
    this.y2 = this.y + 1;

    this.main.style.top = this.diffTop + this.x - 4 + 'px';
    this.main.style.left = this.diffLeft + this.y - 8 + 'px';
};

Role.prototype.isWall = function(cx, cy) {
    var points = [];
    var ret;
    var retX = true,
        retY = true;
    if(cx === -1) {
        points.push({
            x: this.y0,
            y: this.x0
        }, {
            x: this.y0,
            y: this.x2
        });

        if(cy === -1) {
            points.push({
                x: this.y2,
                y: this.x0
            });
        } else {
            points.push({
                x: this.y2,
                y: this.x2
            });
        }
    } else {
        points.push({
            x: this.y2,
            y: this.x0
        }, {
            x: this.y2,
            y: this.x2
        });

        if(cy === -1) {
            points.push({
                x: this.y0,
                y: this.x0
            });
        } else {
            points.push({
                x: this.y0,
                y: this.x2
            });
        }
    }

    for(var i = 0; i < 3; i++) {
        ret = this.pointCheck(points[i].x, points[i].y, cx, cy);

        if(!ret.x) {
            retX = false;
        }

        if(!ret.y) {
            retY = false;
        }

        if(!retX && !retY) {
            break ;
        }
    }
    
    return {
        x: retX,
        y: retY
    };
};

Role.prototype.pointCheck = function(x, y, cx, cy) {
    var start, r;
    var retX = true,
        retY = true;

    x = x >> 0;
    y = y >> 0;

    x += ((1 * cx) >> 0);

    if(x > 0 && y > 0) {
        start = y * width * 4 + x * 4;
        r = pixData[start];
        if(r === 0) {
            drawDebug(x, y, 'blue');
            retX = false;
        }
    }

    x -= (1 * cx);
    y += (1 * cy);
    if(y > 0 && x > 0) {
        start = y * width * 4 + x * 4;
        r = pixData[start];
        if(r === 0) {
            drawDebug(x, y, 'blue');
            retY = false;
        }
    }
    
    return {
        x: retX,
        y: retY
    };
};

Role.prototype.check = function(x, y, cx, cy) {
    var ret, data;
    x = (x/2+0.5) * this.disX;
    y = (y) * this.disY;

    cx = Math.abs(cx) < 0.01 ? 0 : cx / Math.abs(cx);
    cy = Math.abs(cy) < 0.01 ? 0 : cy / Math.abs(cy);

    drawDebug(this.y >> 0, this.x >> 0, 'blue');
    ret = this.isWall(cy, cx);

    data = {
        x: (ret.y === true) ? x : 0,
        y: (ret.x === true) ? y : 0
    };

    return data;
};

Role.prototype.hide = function() {
    c2d.style.opacity = 0;
    this.main.style.opacity = 0;
};

Role.prototype.show = function() {
    c2d.style.opacity = 1;
    this.main.style.opacity = 1;
};

var role = new Role();
role.update();