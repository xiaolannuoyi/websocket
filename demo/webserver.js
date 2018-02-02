
var app = require('http').createServer()
var io = require('socket.io')(app);


app.listen(8001);
var clientCount = 0;
io.on('connection', function (socket) {
    clientCount++
    socket.nickname = "user" + clientCount;
    io.emit("enter",socket.nickname+"进入")

    socket.on("message",function (str) {
    	io.emit("message",socket.nickname+": "+ str)
    })
    socket.on("disconnect",function() {
    	io.emit("disconnect",socket.nickname+"离开")
    })
});