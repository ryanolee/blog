import {MutableRefObject} from "react"
import * as PIXI from "pixi.js"
import EntityHandler from "../handler/EntityHandler"

/**
 * Mechanism for binding a handler to a given entity
 */
export default abstract class EntityBinding<T> {
    protected container: MutableRefObject<HTMLDivElement>
    protected app: MutableRefObject<PIXI.Application>
    protected handler: MutableRefObject<T>
    protected enabled: boolean = false

    constructor(
        container: MutableRefObject<HTMLDivElement>,
        app: MutableRefObject<PIXI.Application>,
        handler: MutableRefObject<T>
    ){
        this.container = container
        this.app = app
        this.handler = handler
    }

    disable(){
        this.enabled = false
    }

    enable(){
        this.enabled = true
    }

    isEnabled(): boolean {
        return this.enabled
    }

    getListener(fn: CallableFunction){
        return (...args) => {
            if(!this.enabled){
                return
            }

            return fn(...args)
        }
    }

    abstract init()

    abstract teardown()
}