//服务端代码
var app = require('http').createServer()
var io = require('socket.io')(app);

const PORT = 3000;
//客户端计数
var clientCount = 0
//用来存储客户端socket
socketMap = {}
app.listen(PORT);


var bindListenter = function (socket,event) {
	socket.on(event,function(data) {
    	if(socket.clientNum % 2 ==0){   //如果客户端是第二个
    		if(socketMap[socket.clientNum - 1]){
    			socketMap[socket.clientNum - 1].emit(event,data);//给第一个客户端发送数据
    		}
    	}else{
    		if(socketMap[socket.clientNum + 1]){
    			socketMap[socket.clientNum + 1].emit(event,data);
    		}
    		
    	}
    })
}
io.on('connection', function (socket) {
	clientCount = clientCount+1;
	socket.clientNum = clientCount;
	socketMap[clientCount] = socket;
	if(clientCount % 2 == 1){
		socket.emit("waitting","等待另一个玩家...");
	}else{
		socket.emit("start");//第二个用户开始
		if(socketMap[(clientCount-1)]){
			socketMap[(clientCount-1)].emit("start");//第一个用户开始
		}else{
			socket.emit("leave");
		}
		
	}

	
	bindListenter(socket,"init");
	bindListenter(socket,"next");

	bindListenter(socket,"rotate");
	bindListenter(socket,"down");
	bindListenter(socket,"left");
	bindListenter(socket,"right");
	bindListenter(socket,"fall");
	bindListenter(socket,"fixed");
	bindListenter(socket,"line");
	
	bindListenter(socket,"time");
	bindListenter(socket,"lose");
	bindListenter(socket,"bottomLines")
	bindListenter(socket,"addTailLines")
    socket.on("disconnect",function() {
    	if(socket.clientNum % 2 ==0){   //如果客户端是第二个
    		if(socketMap[socket.clientNum - 1]){
    			socketMap[socket.clientNum - 1].emit('leave');//给第一个客户端发送数据
    		}
    	}else{
    		if(socketMap[socket.clientNum + 1]){
    			socketMap[socket.clientNum + 1].emit('leave');
    		}
    	}
    	delete(socketMap[socket.clientNum])
    })
});


console.log("websocket 监听端口:",PORT);