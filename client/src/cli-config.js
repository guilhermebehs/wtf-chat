export class CliConfig{
    constructor({username, room, hostUri}){
       this.username = username
       this.room = room
       const {hostname,port, protocol} = new URL(hostUri)
       this.host = hostname
       this.port = port
       this.protocol = protocol.replace(/\W/g, '')
    }


    static parseArgs(commands){
        const cmdPrefix = '--'
        const cmd = new Map()

        for(const key in commands){
            const index = parseInt(key)
            if(!commands[key].includes(cmdPrefix)) continue

            cmd.set(
                commands[key].replace(cmdPrefix, ''),
                commands[index + 1]
            )
        }

        return new CliConfig(Object.fromEntries(cmd))
    }
}