// 俄罗斯方块的核心

var Game = function() {
    // dom元素
    var gameDiv,
        nextDiv,
        scoreDiv,
        resultDiv;

    // 分数
    var score = 0;

    // 游戏区域矩阵
    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // 当前方块
    var cur;

    // 下一个方块
    var next;

    // divs
    var nextDivs = [];
    var gameDivs = [];

    // 初始化div
    //通过data数据遍历出这样的div小方格  <div class="none" style="top: 0px; left: 0px;"></div>
    //初始化的都是none的小方格
    //container 中存入这些div
    //div=[] 存放每一行的数据
    //divs 存放所有div的数据,是一个二维数组
    var initDiv = function(container, data, divs) {
        for (var i = 0; i < data.length; i++) {
            var div = [];
            for (var j = 0; j < data[0].length; j++) {
                var newNode = document.createElement("div");
                newNode.className = "none";
                newNode.style.top = (i * 20) + "px";
                newNode.style.left = (j * 20) + "px";
                container.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    };

    //刷新div
    //通过数据来刷新小方格
    //空---none;已经落下来的---done;当前的---current
    var refreshDiv = function(data, divs) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] == 0) {
                    divs[i][j].className = "none";
                } else if (data[i][j] == 1) {
                    divs[i][j].className = "done";
                } else if (data[i][j] == 2) {
                    divs[i][j].className = "current";
                }
            }
        }
    };
    // 检测点是否合法
    //pos  当前块的原点 cur.origin
    //x,y 对应i行j列 y行x列  
    var check = function(pos, x, y) {
        if (pos.x + x < 0) {  //超出上边界
            return false;
        } else if (pos.x + x >= gameData.length) { //超出下边界
            return false;
        } else if (pos.y + y < 0) { //超出左边界
            return false;
        } else if (pos.y + y >= gameData[0].length) { //超出右边界
            return false;
        } else if (gameData[pos.x + x][pos.y + y] === 1) {  //当前位置有站位
            return false;
        } else {
            return true;
        }
    };
     // 检测数据是否合法
    var isValid = function(pos, data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {  //检查有数据的点,
                    if (!check(pos, i, j)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // 设置数据
    var setData = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    console.log("设置数据===cur.origin.x + i:",cur.origin.x + i,";.origin.y + j:",cur.origin.y + j)
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                }
            }
        }
    };
    //清除数据
    var clearData = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    console.log("清除数据===cur.origin.x + i:",cur.origin.x + i,";.origin.y + j:",cur.origin.y + j)
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }
            }
        }
    };
    //下移
    var down = function() {
        if (cur.canDown(isValid)) {
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData, gameDivs);
            return true;
        } else {
            return false;
        }
    }
    // 左移
    var left = function() {
        if (cur.canLeft(isValid)) {
            clearData();
            cur.left();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }

    // 右移
    var right = function() {
        if (cur.canRight(isValid)) {
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }
    //旋转
    var rotate = function() {
        if (cur.canRotate(isValid)) {
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }
     // 方块移动到底部固定
    var fixed = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    if (gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                    }
                }
            }
        }
        refreshDiv(gameData, gameDivs);
    }
    // 把小视窗方块放到游戏里，并生成新的方块
    var performNext = function(type, dir) {
        cur = next;
        setData();
        next = SquareFactory.prototype.make(type, dir);
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
    }
    // 消行
    var checkClear = function() {
        var line = 0;
        for (var i = gameData.length - 1; i >= 0; i--) {//从gameData的最后一行开始遍历
            var clear = true;
            for (var j = 0; j < gameData[0].length; j++) {//遍历每行的数据
                if (gameData[i][j] != 1) {//如果这一行有一个不等于1,就不消行
                    clear = false;
                    break;
                }
            }
            if (clear) {
                line += 1;
                for (var m = i; m > 0; m--) {  //整体下移 ,从最后一行向上遍历
                    for (var n = 0; n < gameData[0].length; n++) {
                        gameData[m][n] = gameData[m - 1][n];//将m-1行的数据赋值给m行
                    }
                }
                for (var n = 0; n < gameData[0].length; n++) {//最上面一行无数据,填充0
                    gameData[0][n] = 0;
                }
                i++;//消除一行后,这一行需要重新遍历
            }
        }
        return line;
    }

     // 检查游戏结束
    var checkGameOver = function() {
        var gameOver = false;
        for (var i = 0; i < gameData[0].length; i++) {
            if (gameData[1][i] === 1) {
                gameOver = true;
            }
        }
        return gameOver;
    }
    // 界面显示游戏结束
    var gameOver = function(win) {
        if (win) {
            resultDiv.innerText = "YOU WIN!"
        } else {
            resultDiv.innerText = "GAME OVER!"
        }

    }
     // 设置时间
    var setTime = function(time) {
        document.getElementById("local_time").innerText = time;
    }
    // 分数增加
    var addScore = function(line) {
        var s = 0;
        switch (line) {
            case 1:
                s = 10;
                break;
            case 2:
                s = 30;
                break;
            case 3:
                s = 60;
                break;
            case 4:
                s = 100;
                break;
            default:
                break;
        }
        score = score + s;
        scoreDiv.innerText = score;
    }
    //增加干扰功能,底部增加行
    var addTailLines = function (lines) {
        for(var i=0;i<gameData.length-lines.length;i++){
            gameData[i] = gameData[i+lines.length]  //整体上移,移动lines的长度
        }
        for(var i=0;i<lines.length;i++){
            gameData[gameData.length - lines.length +i] = lines[i] //底部的那几行 
        }
        cur.origin.x = cur.origin.x - lines.length;
        if(cur.origin.x<0){
            cur.origin.x = 0
        }
        refreshDiv(gameData,gameDivs);
    }
    // 初始化
    var init = function(doms, type, dir) {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeDiv = doms.timeDiv;
        scoreDiv = doms.scoreDiv;
        resultDiv = doms.resultDiv;
        next = SquareFactory.prototype.make(type, dir);
        initDiv(gameDiv,gameData,gameDivs);
        initDiv(nextDiv,next.data,nextDivs);
        refreshDiv(next.data,nextDivs)
    }

    // 导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    this.fall = function () {
        while(down());
    }
    this.fixed = fixed;
    this.performNext = performNext;
    this.checkClear = checkClear;
    this.checkGameOver = checkGameOver;
    this.setTime = setTime;
    this.addScore = addScore;
    this.gameOver = gameOver;

    this.addTailLines = addTailLines;
}