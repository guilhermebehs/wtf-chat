/*
 node index.js \
    --username guilhermebehs \
    --room sala01 \
    --hostUri localhost
*/

import Event from 'events'
import { TerminalController } from './src/terminal-controller.js'
import { CliConfig } from './src/cli-config.js'


const [nodePath, filePath, ...commands] = process.argv
console.log(CliConfig.parseArgs(commands))

const eventEmitter = new Event()
const terminalController = new TerminalController(eventEmitter)
terminalController.initializeTable()