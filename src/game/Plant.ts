import { GameObject } from "./GameObject";
const SEED_GROWTH_RATE = .1;
const MAX_HEALTH_SPROUT = 30;
const SPROUT_GROWTH_RATE = .2;
const MAX_HEALTH_BABY_BUSH = 50;
const BABY_BUSH_GROWTH_RATE = .3;
const MAX_HEALTH_BUSH = 100;
const MAX_HEALTH_BERRY= 15;

export class Plant extends GameObject {
    public plants: Record<string, Plant>;

    constructor(
        public ownerName: string,
        public type: string,
        public x: number,
        public y: number,
        public team: 'blue' | 'red',
        public id: string,
        public phase: string,
        public maxHealth: number,
        public shouldRemove: boolean = false,
        
    ) {
        super(
            ownerName,
            type,
            x,
            y,

            team,
            id,
            phase,

            5, // Set maxHealth
            5, // Set health
            0, // Set speed

            '', // Set isUsedBy
            null, // Set target
            16, // Set collisionRadius

            0, // Set attackPower
            0, // Set lastAttackTime
            1000, // Set attackCooldown

            false, // Remove
            true, // isMoveable
        );
    }
    public berries: {};
    public update() {
        super.update();
        // Grow the seed to a sprout
        if (this.phase === 'seed' || this.phase === 'germinating') {
            this.health +=SEED_GROWTH_RATE;
            if (this.health > MAX_HEALTH_SPROUT / 2) {
                this.phase = 'germinating';
            }
            if (this.health >= MAX_HEALTH_SPROUT) {
                this.phase = 'sprout';
                this.maxHealth = MAX_HEALTH_SPROUT;
            }
        }
        // Grow sprout to baby bush
        if (this.phase === 'sprout') {
            this.health += SPROUT_GROWTH_RATE;
            if (this.health >= MAX_HEALTH_BABY_BUSH) {
                this.phase = 'babyBush';
                this.maxHealth = MAX_HEALTH_BABY_BUSH;
                this.isMovable = false;
            }
        }
        // Grow baby bush to bush and grow some berries
        if (this.phase === 'babyBush') {
            this.health += BABY_BUSH_GROWTH_RATE;
            //grow a berry
            if (this.health >= MAX_HEALTH_BABY_BUSH) {
            //     const berryID = `berry_${this.id}_${berries.length + 1}`;
            //     this.berries[berryID] = 1
            //   this.health =- MAX_HEALTH_BERRY;
            }
            //grow into bush
            if (this.health >= MAX_HEALTH_BUSH) {
                this.phase = 'bush';
                this.maxHealth = MAX_HEALTH_BUSH;
            }
        }
    }
}
