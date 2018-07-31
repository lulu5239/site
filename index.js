var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var donnes = {}

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/socket_html.html');
});
app.get('/', function(req, res){
  res.send("Bienvenue.");
});

io.on('connection', function(socket){
  console.log('Membre connecté.');
  socket.on('disconnect', function(){
    console.log('Membre déconnecté.');
  });
});
io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		console.log('Message posté : ' + msg.txt)
		io.emit("chat message", msg)
	});
	socket.on("infos", (x) => {
		if(donnes[x.id]!=undefined){
			if(x.token == donnes[x.id].token){
				io.emit("infos."+x.id, {nom: donnes[x.id].nom, token: x.token})
			}
		}
	})
	socket.on("+nom", (x)=>{
		donnes[x.id] = {nom: x.nom, token: x.token}
		io.emit("infos."+x.id, {nom: donnes[x.id].nom, token: x.token})
	})
	socket.on("fermer", ()=>{
		io.emit("lock")
	})
	socket.on("ouvrir", ()=>{
		io.emit("unlock")
	})
	socket.on("mp", msg=>{
		var x = msg.txt.split(" ")[0]
		if(donnes[x.replace("@", "")]!=undefined){
			io.emit("mp."+x.replace("@", "") ,msg)
		}
	})
});

io.on('connection', function(socket){
  socket.on("off", fvvf=>{
	  console.log("Indisponible !")
  })
});

http.listen(80, function(){
  console.log('En ligne.');
});
