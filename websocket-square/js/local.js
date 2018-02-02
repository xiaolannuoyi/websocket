// 本地游戏逻辑

var Local = function(socket) {
    // 游戏对象
    var game;
    //时间间隔
    var INTERVAL = 2000;
    //定时器
    var timer = null

    // 游戏总时间计数器
    var timeCount = 0;
    //时间
    var time = 0;
    // 绑定键盘事件
    var bindKeyEvent = function() {
        document.onkeydown = function(e) {
            if (e.keyCode == 38) { // up
                game.rotate();
                socket.emit("rotate")
            } else if (e.keyCode == 39) { //right
                game.right();
                socket.emit("right")
            } else if (e.keyCode == 40) { //down
                game.down();
                socket.emit("down")
            } else if (e.keyCode == 37) { //left
               game.left();
               socket.emit("left")
            } else if (e.keyCode == 32) { //space
                game.fall();
                socket.emit("fall")
            }
        }
    }

     // 移动
    var move = function() {
        timeFunc();
        if(!game.down()){//如果到底部
            game.fixed() //固定
            socket.emit("fixed")
            var line = game.checkClear()//消行
            if(line) {
                game.addScore(line);
                socket.emit('line',line);
                if(line>1){
                    var bottomLines = generateBottomLine(line);
                    socket.emit("bottomLines",bottomLines);
                }
            }
            var gameOver = game.checkGameOver();
            if(gameOver){
                game.gameOver(false);
                document.getElementById('remote_gameOver').innerHTML = '你赢了'
                socket.emit("lose");
                stop();
            }else{
                //将产生的图形缓存
                var t = generateType();
                var d = generateDir();
                game.performNext(t,d);//下一个图形,
                socket.emit("next",{type: t, dir: d});//将产生的图形,通过socket传递
            }
        }else{
            socket.emit("down")
        }
        
    }
    // 随机生成一个方块种类
    var generateType = function() {
        return Math.floor(Math.random() * 7);
    }

    // 随机生成一个旋转次数
    var generateDir = function() {
        return Math.floor(Math.random() * 4);
    }
    // 结束
    var stop = function() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;
    }
    // 计时函数
    var timeFunc = function() {
        timeCount = timeCount + 1;
        if (timeCount === 5) {  //时间间隔200  5次是1秒
            timeCount = 0;
            time = time + 1;
            game.setTime(time);
            socket.emit("time",time);
            // if(time % 10 == 0){
            //     game.addTailLines(generateBottomLine(1))
            // }
        }
    }
    //随机增加行
    var generateBottomLine = function (lineNum) {
        var lines = [];
        for (var i=0;i<lineNum;i++) {
            var line = [];
            for(var j=0;j<10;j++){
                line.push(Math.ceil(Math.random()*2)-1)
            }
            lines.push(line)
        }
        return lines;
    }
    // 开始
    var start = function() {
        var doms = {
            gameDiv: document.getElementById("local_game"),
            nextDiv: document.getElementById("local_next"),
            scoreDiv: document.getElementById("local_score"),
            timeDiv: document.getElementById("local_time"),
            resultDiv: document.getElementById("local_gameOver")
        }
        game = new Game();
        //将产生的图形缓存
        //game.init(doms,generateType(),generateType());
        var type = generateType();
        var dir = generateDir();
        game.init(doms,type,dir);//游戏初始化,
        socket.emit("init",{type: type, dir: dir});//将产生的图形,通过socket传递
        bindKeyEvent();
        //将产生的图形缓存
        //game.performNext(generateType(),generateType());
        var t = generateType();
        var d = generateDir();
        game.performNext(t,d);//下一个图形,
        socket.emit("next",{type: t, dir: d});//将产生的图形,通过socket传递
        
        timer = setInterval(move,INTERVAL)
    }
    // 导出API
    //this.start = start;
    socket.on('start',function () {
        document.getElementById('waitting').innerHTML = "对战";
        start();
    })
    socket.on('lose',function () {
        game.gameOver(true)
        stop();
    })
    socket.on("leave",function (data){
        document.getElementById('local_gameOver').innerHTML = "对方掉线";
        document.getElementById('remote_gameOver').innerHTML = "已掉线";
    })
    socket.on("bottomLines",function (data){
        game.addTailLines(data);
        socket.emit("addTailLines",data)
    })
}