var Remote = function (socket) {
	//游戏对象
	var game
	//绑定事件
	var bindEvents = function () {
		socket.on("init",function (data){
			start(data.type,data.dir);
		})
		socket.on("next",function (data){
			game.performNext(data.type,data.dir);
		})

		socket.on("rotate",function (data){
			game.rotate();
		})
		socket.on("down",function (data){
			game.down();
		})
		socket.on("left",function (data){
			game.left();
		})
		socket.on("right",function (data){
			game.right();
		})
		socket.on("fall",function (data){
			game.fall();
		})
		socket.on("fixed",function (data){
			game.fixed();
		})
		socket.on("line",function (data){
			game.checkClear();//消行
			game.addScore(data);//增行
		})
		socket.on("time",function (data){
			game.setTime(data);
		})
		socket.on("lose",function (data){
			game.gameOver(false);
		})
		socket.on("addTailLines",function (data){
			game.addTailLines(data)
		})
	}
	var start = function(type,dir) {
        var doms = {
            gameDiv: document.getElementById("remote_game"),
            nextDiv: document.getElementById("remote_next"),
            scoreDiv: document.getElementById("remote_score"),
            timeDiv: document.getElementById("remote_time"),
            resultDiv: document.getElementById("remote_gameOver")
        }
        game = new Game();
        game.init(doms,type,dir);
    }

    bindEvents();
}