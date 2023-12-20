import { events } from "./events.js";

export class Controller {
 

    #users = new Map();
    #rooms = new Map();

    constructor({ socketServer }) {
        this.socketServer = socketServer;
    }

    onNewConnection(socket) {
        const { id } = socket;
        console.log('connection stablished with', id);
        const userData = {id, socket}
        this.#updateGlobalUserData(id, userData)
        socket.on('data', this.#onSocketData(id))
        socket.on('error', this.#onSocketClosed(id))
        socket.on('end', this.#onSocketClosed(id))
    }

    broadCast({socketId, roomId, event, message, includeCurrentSocket = false}){
        const usersOnRoom = this.#rooms.get(roomId)

        for(const [key, user] of usersOnRoom){
            if(!includeCurrentSocket && key === socketId) continue;
            this.socketServer.sendMessage(user.socket, event, message)
        }
    }

    async joinRoom(socketId, userData){
        console.log(`${userData.userName} joined!  ${[socketId]}`)
        const {roomId} = userData;

        const user = this.#updateGlobalUserData(socketId, userData)
        const users = this.#joinUserOnRoom(roomId, user)

        const currentUsers = Array.from(users.values())
           .map(({id, userName}) => ({userName, id}))

        // atualiza o usuario que conectou sobre os usuarios que ja estao na sala
        this.socketServer.sendMessage(user.socket, events.UPDATE_USERS, currentUsers)

        this.broadCast({
            socketId,
            roomId,
            message: {id: socketId, userName: userData.userName},
            event: events.NEW_USER_CONNECTED
        })
    }

    message(socketId, data) {
        const { userName, roomId } = this.#users.get(socketId)

        this.broadCast({
            roomId,
            socketId,
            event: events.MESSAGE,
            message: { userName, message: data },
            includeCurrentSocket: true,
        })

    }

    #joinUserOnRoom(roomId, user){
        const usersOnRoom = this.#rooms.get(roomId) ?? new Map();
        usersOnRoom.set(user.id, user)
        this.#rooms.set(roomId, usersOnRoom)

        return usersOnRoom;
    }
    #onSocketData(id){
            return data => {
                try{
                    const { event, message } = JSON.parse(data);
                    this[event](id, message)
                }
                catch(error){
                    console.error('wrong event format!!!', data.toString())
                }
            }
        
    }

    #logoutUser(id, roomId){
        this.#users.delete(id);
        const usersOnRoom = this.#rooms.get(roomId);
        usersOnRoom.delete(id);

        this.#rooms.set(roomId, usersOnRoom)
    }

    #onSocketClosed(id){
        return _ => {
            const { userName, roomId } = this.#users.get(id)
            console.log(userName, 'disconnected', id)
            this.#logoutUser(id, roomId)
            this.broadCast({
                roomId,
                socketId: id,
                message: {id, userName},
                event: events.DISCONNECT_USER
            })
        }
    }

    #updateGlobalUserData(socketId, userData){
        const users = this.#users;
        const user = users.get(socketId) ?? {};
        const updatedUserData = {
            ...user,
            ...userData
        }

        users.set(socketId, updatedUserData);
        return users.get(socketId)
    }
}