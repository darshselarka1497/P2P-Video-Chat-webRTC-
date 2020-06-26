const Player = require('./videoplayer.js')

navigator.mediaDevices.getUserMedia({video:true, audio:true}).then(function (stream){
    //signaling the peer
    const signalHub = require('signalhub')
    const createSwarm = require('webrtc-swarm')

    //creating the signal hub in the user-defined port
    const hub = signalHub('s1',['http://localhost:8080'])
    const swarm = createSwarm(hub, {stream: stream})

    //creating the video player to render in the browser
    //user 1 = usually you!
    const u1 = new Player({x:0,y:0,color:'black',left:0,top:0})
    u1.addStream(stream)

    //other users (peer nodes)
    const users = {}
    swarm.on('connect', function(peer,id){
        if(!users[id]){
            users[id] = new Player({
                x:300,
                y:0,
                left:200,
                top:0,
                color: 'red'
            })
            peer.on('data', function(data){
                data = JSON.stringify(data) // may give an error
                users[id].update(data)
            })
            users[id].addStream(peer.stream)
        }
    })

    //action when webRTC disconnects
    swarm.on('disconnect', function(peer,id){
        if(users[id]){
            users[id].element.parentNode.removeChild(users[id].element)
            delete users[id]
        }
    })

    setInterval(function(){
        console.log("Intervall call");
        u1.update()

        const u1string = JSON.stringify(u1)
        swarm.peers.forEach(function (peer){
            peer.send(u1string)
        })
    },100)
    })

    //adding the stream to the webRTC swarm to access the data in the peer network
    const swarm = createSwarm(hub,{
        stream: stream
    })

    //adding the stream to the video element
    Player.prototype.addStream = function(stream){
        this.element.srcObject=stream
        this.element.play()
    }



    