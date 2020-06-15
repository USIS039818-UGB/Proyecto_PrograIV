var Express = require('express'), 
    app = Express(),
    Server = require('http').Server(app),
    IO = require('socket.io')(Server),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    dbName = 'chat'


IO.on('connection', function (socket) {
    
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},function (err, client) {
        const db = client.db(dbName);

        db.collection(`ChatCollect`).find({}).toArray(function (err,msg) {
            socket.emit('messages', msg);
        });

    });

    socket.on('add-message', function (data) {
    
        MongoClient.connect(url, function (err, client) {
            const db = client.db(dbName);
            
            
            db.collection(`ChatCollect`).insert(data);

            db.collection(`ChatCollect`).find({}).toArray(function (err,msg) {
                IO.sockets.emit('messages', msg);
            });
    
        });
    

    });
    
});

Server.listen(6678, function () {
    console.log("Servidor esta funcionando en http://localhost:6678");
    
});