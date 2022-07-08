import { EntityPerformanceConfig } from "../EntityPerformance"
import EntityHandler from "../handler/EntityHandler"
import Entity from "../entity/Entity"
import BoidBehaviour from "./BoidBehaviour"
import HandlerBehaviour from "./HandlerBehaviour"

class BoidHandlerBehaviour extends HandlerBehaviour {

    public entityPerformanceConfig: EntityPerformanceConfig = {
        cacheKey: "BoidPerfCache-v1",
        min: 100,
        max: 500,
        step: 10
    }
    
    constructor(eh: EntityHandler){
        super(eh)
    }


    public onRegistration(){

    }
    public onEntitiesAdded(entities: Entity[]){
        entities.forEach((entity) => {
            entity.setBehaviour(new BoidBehaviour(entity))
        })
    }
}

export default BoidHandlerBehaviour