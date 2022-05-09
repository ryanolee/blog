import EntityHandler from "../handler/EntityHandler";

abstract class HandlerBehaviour {
    public handler: EntityHandler

    constructor(handler: EntityHandler){
        this.handler = handler
    }

    onResize(){}

    onUpdate(){}
    
    onDraw(){}
}

export default HandlerBehaviour