var PORT = process.env.PORT || 4000;
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.send('<h1>Node App </h1>');
});

connections = [];
connectionsData = [];
io.set('origins', '*:*');
io.on('connection', socket => {
  // socket.on('message', ({ name, message }) => {
  //   io.emit('message', { name, message })
  // });
  socket.emit("socketId", socket.id);
    socket.on("sendMessage", body => {
        io.emit("message", body)
    })
    socket.on("userConnect", userName => {
        const dataUser = {idSocket: socket.id,user: userName}
        connectionsData.push(dataUser);
        console.log(connectionsData);
        io.emit("whoIsOnline", connectionsData);
    });
    connections.push(socket.id);
    console.log('Terhubung: %s sockets sedang terhubung', connections.length);
    // console.log(connections);
    //console.log(connectionsData);

    socket.on('message', ({ text,username,datetime }) => {
      io.emit('message', { text,username,datetime })
    })

    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket.id), 1);
        connectionsData.splice(connectionsData.findIndex(x => x.idSocket === socket.id), 1);
        console.log('Terputus: %s socket sedang terhubung', connections.length);
        io.emit("whoIsOnline", connectionsData);
        //console.log(connectionsData);
    });
    
})

http.listen(PORT, function() {
  console.log('listening on port '+ PORT)
})
