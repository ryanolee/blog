import EntityHandler from "../handler/EntityHandler";
import Entity from "../entity/Entity";
import { EntityPerformanceConfig } from "../EntityPerformance";

abstract class HandlerBehaviour {
    public handler: EntityHandler

    public abstract entityPerformanceConfig: EntityPerformanceConfig

    constructor(handler: EntityHandler){
        this.handler = handler
    }

    /**
     * Triggered for each entity added to handler and used to get 
     * entites configured in batch on a per particle basis
     */
    abstract onEntitiesAdded(entities: Entity[])

    /**
     * Triggered when handler is bound to a given context
     */
    onRegistration(){}
    
    /**
     * Triggered on each resize
     */
    onResize(){}

    /**
     * Triggered on updates to particles 
     */
    onUpdate(){}
    
    /**
     * Triggered on draw
     */
    onDraw(){}
}

export default HandlerBehaviour