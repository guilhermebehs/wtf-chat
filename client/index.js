import Event from 'events'
import { TerminalController } from './src/terminal-controller.js'
import { CliConfig } from './src/cli-config.js'
import { SocketClient } from './src/socket.js'
import { EventManager } from './src/event-manager.js'


const [nodePath, filePath, ...commands] = process.argv
const opts = CliConfig.parseArgs(commands)

const eventEmitter = new Event()
const socketClient = new SocketClient(opts)
const terminalController = new TerminalController(eventEmitter)
const eventMenager = new EventManager({  eventEmitter, socketClient })
const events = eventMenager.getEvents()
await socketClient.initialize()
socketClient.attachEvents(events)
await terminalController.initializeTable()

const data = {
    roomId: opts.room,
    userName: opts.username

}
eventMenager.joinRoomAndWaitForMessages(data)