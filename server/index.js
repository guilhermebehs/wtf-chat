import { Controller } from "./src/controller.js";
import { events } from "./src/events.js";
import { SocketServer } from "./src/socket.js";
import Events from 'events';

const eventEmitter = new Events();

// async function testServer(){
//     const options = {
//         port: 9898,
//         host: 'localhost',
//         headers: {
//             Connection: 'Upgrade',
//             Upgrade: 'websocket'
//         }
//     }
    
//     const http = await import('http');
//     const req = http.request(options);
//     req.end()

//     req.on('upgrade', (res, socket) => {
//         socket.on('data', data => {
//             console.log('client received', data.toString())
//         })

//         setInterval(()=>{
//             socket.write('Hello!')
//         }, 3000)
//     })
    
// }

const port = process.env.PORT || 9898;

const socketServer = new SocketServer({ port });
const server  = await socketServer.initialize(eventEmitter);
console.log(`socket server is running at ${server.address().port}`);
const controller = new Controller({socketServer})
eventEmitter.on(
    events.NEW_USER_CONNECTED,
    controller.onNewConnection.bind(controller)
)
eventEmitter.on(events.NEW_USER_CONNECTED, (socket)=>{
    console.log('new connection', socket.id);
    socket.on('data', data => {
        console.log('server received', data.toString())
    })
})

//await testServer();