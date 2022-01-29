
export default {
    /**
     * The speed correction for particles
     */ 
    particle_speed: 0.001,
    /**
     * Particle count to render
     */
    max_particles: 10000,

    /**
     * Absolute minimum number of particles that can be handled by browser
     */
    min_particles: 1000,
    
    /**
     * Size the particles render at
     */
    particle_size: 5,
    /**
     * Maximum speed any particle should move at
     */
    speed_limit: 100,
    /**
     * How much a particle hitting the wall of the page should
     * be slowed by
     */
    dampening_factor: 0.4,
    /**
     * How much spice should the simulation shake in to 
     * make it look cool
     */
    chaos: 0.1,
    /**
     * Force correction to slowdown on axis for target
     */
    force_correction_to_target: 0.95,
    /**
     * Number of pixels to force particles away from edge for
     */
    edge_padding: 5,
    /**
     * Target frame rate
     */
    frame_rate: 60,
    /**
     * The number of steps to render before computing if we need to drop the particle count
     */
    performance_sample: 10,
    /**
     * The proportion of the particles that should be taken away based on the preformance of the page
     */
    performance_step: 500
}