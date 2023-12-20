import { ComponentsBuilder } from "./components-builder.js"
import { events } from "./events.js"

export class TerminalController{
    
    #eventEmitter
    #usersCollors

    constructor(eventEmitter){
        this.#eventEmitter = eventEmitter
        this.#usersCollors = new Map()
    }

    #pickCollor(){
        return `#` + ((1 << 24) * Math.random() | 0).toString(16) + `-fg`
    }

    #getUserCollor(userName){
        if(!this.#usersCollors.has(userName)){
          const collor = this.#pickCollor()
          this.#usersCollors.set(userName, collor)
        }
        return this.#usersCollors.get(userName)       
    }


    #onInputReceived(eventEmitter){
        return function (){
            const message = this.getValue()
            eventEmitter.emit(events.app.MESSAGE_SENT,message)
            this.clearValue()
        }
    }

    #onMessageReceived({chat, screen}){
        return msg =>{
            const {userName, message} = msg
            const collor = this.#getUserCollor(userName)
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
            screen.render()
        }
    }

    #onActivityLogUpdated({activityLog, screen}){
        return msg =>{
            const [userName] = msg.split(/\s/g)
            const collor = this.#getUserCollor(userName)
            activityLog.addItem(`{${collor}}{bold}${msg}{/}`)
            screen.render()
        }
    }
 
    #onStatusUpdated({status, screen}){
        return msg =>{
            //pega a descricao fixa
            const {content} = status.items.shift()
            status.clearItems()
            status.addItem(content)
            msg.forEach((userName)=>{
               const collor = this.#getUserCollor(userName)
               status.addItem(`{${collor}}{bold}${userName}{/}`)
            })
           
            screen.render()
        }
    }

    #registerEvents(eventEmitter, components){
        eventEmitter.on(events.app.MESSAGE_RECEIVED,this.#onMessageReceived(components))
        eventEmitter.on(events.app.ACTIVITY_LOG_UPDATED,this.#onActivityLogUpdated(components))
        eventEmitter.on(events.app.STATUS_UPDATED,this.#onStatusUpdated(components))
    }

    async initializeTable(){
   
        const components = new ComponentsBuilder()
              .setScreen({title: 'WTF Chat'})
              .setLayoutComponent()
              .setInputComponent(this.#onInputReceived(this.#eventEmitter))
              .setChatComponent()
              .setActivityLogComponent()
              .setStatusComponent()
              .build()

        this.#registerEvents(this.#eventEmitter,components)      
        components.input.focus()
        components.screen.render()  
    }
}