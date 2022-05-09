import config from "../config";
import Entity from "../entity/Entity";
import EntityHandler from "../handler/EntityHandler";
import Behaviour from "./EntityBehaviour";

class HoverAroundPointBehaviour extends Behaviour{
    protected targetX: number
    protected targetY: number

    constructor(entity: Entity, targetX: number, targetY: number){
        super(entity)
        this.targetX = targetX
        this.targetY = targetY
    }

    update(entityHandler: EntityHandler) {
        this.aimTowards(entityHandler.getWidth(), entityHandler.getHeight())
    }

    /**
     * Updates velocities towards data
     * @param width Width of canvas
     * @param height Height of canvas
     */
     aimTowards(width: number, height: number) {
        // Y component wall bounce
        if (Math.abs(this.entity.x - this.targetX) > 3) {
            if (this.targetX > this.entity.x) {
                this.entity.xv += config.particle_speed * Math.abs(this.targetX - this.entity.x);
            }
            else {
                this.entity.xv -= config.particle_speed * Math.abs(this.targetX - this.entity.x);
            }
        }

        // X component wall bounce
        if (this.entity.x > width || this.entity.x < 0) {
            if (Math.abs(this.entity.xv * config.dampening_factor) < 1) {
                this.entity.xv = (Math.abs(this.entity.xv) / this.entity.xv) * -1;
            }
            else {
                this.entity.xv *= -config.dampening_factor;
            }
            if (Math.abs(this.entity.x - width) > Math.abs(this.entity.x)) {
                this.entity.x = config.edge_padding
            }
            else {
                this.entity.x = width - config.edge_padding
            }
        }

        // Y component (move towards target)
        if (Math.abs(this.entity.y - this.targetY) > 3) {
            if (this.targetY > this.entity.y) {
                this.entity.yv += config.particle_speed * Math.abs(this.targetY - this.entity.y);
            }
            else {
                this.entity.yv -= (config.particle_speed * Math.abs(this.targetY - this.entity.y));
            }
        }

        // Y component (Wall bounce)
        if (this.entity.y > height || this.entity.y < 0) {
            if (Math.abs(this.entity.yv * config.dampening_factor) < 1) {
                this.entity.yv = (Math.abs(this.entity.yv) / this.entity.yv) * -1;
            }
            else {
                this.entity.yv *= -config.dampening_factor;
            }
            if (Math.abs(this.entity.y - height) > Math.abs(this.entity.y)) {
                this.entity.y = config.edge_padding
            }
            else {
                this.entity.y = height - config.edge_padding
            }
        }

        // Apply dampening so we can get to a target
        let dx = Math.abs(this.entity.x - this.targetX)
        let dy = Math.abs(this.entity.y - this.targetY)


        if (dx < 50 || dy < 50) {
            this.entity.yv = Math.min(this.entity.yv * config.force_correction_to_target, 20)
            this.entity.xv = Math.min(this.entity.xv * config.force_correction_to_target, 20)
        }

        this.entity.move()
    }
}

export default HoverAroundPointBehaviour