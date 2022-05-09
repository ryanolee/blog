import EntityHandler from "../handler/EntityHandler";
import EntityBehaviour from "./EntityBehaviour";

class RunAwayBehaviour extends EntityBehaviour {
    update(entityHandler: EntityHandler) {
        const cx = entityHandler.getWidth() / 2
        const cy = entityHandler.getHeight() / 2

        this.entity.applyForce(
            (this.entity.x - cx) * 0.001,
            (this.entity.y - cy) * 0.001
        )

        this.entity.move()

        console.log(this.entity.x > entityHandler.getWidth(),
        this.entity.x < 0,
        this.entity.y > entityHandler.getHeight() ,
        this.entity.y < 0)

        if(this.isOutOfBounds(entityHandler)){
            this.entity.destroy()
            entityHandler.flushEntity(this.entity)
        }
    }

    isOutOfBounds(entityHandler: EntityHandler){
        return this.entity.x > entityHandler.getWidth() ||
            this.entity.x < 0 ||
            this.entity.y > entityHandler.getHeight() ||
            this.entity.y < 0
    }
}

export default RunAwayBehaviour