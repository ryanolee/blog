import Entity from "../entity/Entity";
import EntityHandler from "../handler/EntityHandler";

/**
 * Class for representing behaviour of entities
 */
abstract class EntityBehaviour {
    protected entity
    constructor(entity: Entity){
        this.entity = entity
    }
    
    abstract update(entityHandler: EntityHandler)
}

export default EntityBehaviour