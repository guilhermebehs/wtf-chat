import Event from 'events'
import { TerminalController } from './src/terminal-controller.js'
import { CliConfig } from './src/cli-config.js'
import { SocketClient } from './src/socket.js'


const [nodePath, filePath, ...commands] = process.argv
const opts = CliConfig.parseArgs(commands)

const eventEmitter = new Event()
const socketClient = new SocketClient(opts)
const terminalController = new TerminalController(eventEmitter)
socketClient.initialize()
terminalController.initializeTable()