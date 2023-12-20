import { events } from "./events.js";

export class EventManager {

    #allUsers = new Map()

    constructor({ eventEmitter, socketClient }) {
        this.eventEmitter = eventEmitter;
        this.socketClient = socketClient;
    }

    joinRoomAndWaitForMessages(data) {
        this.socketClient.sendMessage(events.socket.JOIN_ROOM, data);

        this.eventEmitter.on(events.app.MESSAGE_SENT, message => {
            this.socketClient.sendMessage(events.socket.MESSAGE, message);
        })
    }

    updateUsers(users){
        const connectedUsers = users;
        connectedUsers.forEach(({ id, userName }) => this.#allUsers.set(id, userName));
        this.#updateUsersComponent();
    }

    newUserConnected(message){
        const user = message;
        this.#allUsers.set(user.id, user.userName)
        this.#updateUsersComponent()
        this.#updateActivityLogComponent(`${user.userName} joined!`)
    }

    #updateUsersComponent() {
        this.eventEmitter.emit(
            events.app.STATUS_UPDATED,
            Array.from(this.#allUsers.values())
        )
    }

    #updateActivityLogComponent(message){
        this.eventEmitter.emit(
            events.app.ACTIVITY_LOG_UPDATED,
            message
        )
    }

    getEvents(){
        const functions = Reflect.ownKeys(EventManager.prototype)
            .filter(fn => fn !== 'constructor')
            .map(name => [name, this[name].bind(this)])
        
       return new Map(functions)        
    }
}