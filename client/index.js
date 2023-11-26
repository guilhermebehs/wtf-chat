import Event from 'events'
import { TerminalController } from './src/terminal-controller.js'

const eventEmitter = new Event()
const terminalController = new TerminalController(eventEmitter)
terminalController.initializeTable()