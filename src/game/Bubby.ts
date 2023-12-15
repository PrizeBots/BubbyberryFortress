//Bubby.ts
import { Plant } from './Plant';
import { Tower } from './Tower';
import { GameObject } from "./GameObject";
const MAX_HEALTH_BABYBUBBY= 12;
const MAX_HEALTH_BUBBY = 30;

export class Bubby extends GameObject {
    // static bubbies: Record<string, Bubby> = {};
    static objects: Record<string, GameObject> = {};
    private walkingDirection: { x: number, y: number } = { x: 0, y: 0 };
    private walkDuration: number = 0;
    private pauseDuration: number = 0;
    private babyBubbyWidth: number = 16;
    private lastKnownState: Partial<Bubby> = {}; // Store the last known state
    // private objects: Record<string, GameObject>; // Add a property for bubbies
    constructor(
        public type: string,
        public x: number,
        public y: number,

        public team: 'blue' | 'red',
        public id: string,
        public phase: string,

        public maxHealth: number,
        public health: number = maxHealth,
        public speed: number = 1,

        public isUsedBy: string,
        public target: any,
        public collisionRadius: number = 32,

        public attackPower: number,
        public lastAttackTime: number = 0,
        public attackCooldown: number = 1000,

        public shouldRemove: boolean = false,
        public isMovable: boolean = true,

        public plants: Record<string, Plant>,
        // public bubbies: Record<string, Plant>,
    ) {
        super(
            type,
            x,
            y,

            team,
            id,
            phase,

            maxHealth, // Set maxHealth
            health, // Set health
            speed, // Set speed

            isUsedBy, // Set isUsedBy
            null, // Set target
            collisionRadius, // Set collisionRadius

            attackPower, // Set attackPower
            0, // Set lastAttackTime
            1000, // Set attackCooldown

            false, //remove
            true, //isMovable
            /// bubbies,
        );
        Bubby.objects[id] = this;


        // this.bubbies = {};
        //egg hatch timer
        setTimeout(() => {
            if (this && this.phase === 'egg') {
                this.phase = 'babyBubby';
                this.health = 10;
                this.maxHealth = 10;
                this.collisionRadius = this.babyBubbyWidth;
            }
        }, 1000)
    }

    private randomizeDirectionAndDuration() {
        // Generate a random walking direction
        const randomAngle = Math.random() * 2 * Math.PI;
        this.walkingDirection.x = Math.cos(randomAngle);
        this.walkingDirection.y = Math.sin(randomAngle);
        // Generate a random walk duration between 1 and 5 seconds
        this.walkDuration = Math.floor(Math.random() * 50) + 1;
        // Generate a random pause duration between 1 and 3 seconds
        this.pauseDuration = Math.floor(Math.random() * 40) + 1;
    }
    public getUpdates(): Partial<Bubby> {
        const updates: Partial<Bubby> = {};
        // Compare current state with last known state
        if (this.x !== this.lastKnownState.x || this.y !== this.lastKnownState.y) {
            updates.x = this.x;
            updates.y = this.y;
        }
        if (this.health !== this.lastKnownState.health) {
            updates.health = this.health;
        }
        // Update the last known state with the current values
        this.lastKnownState = { ...this };
        return updates;
    }
    public testupdate(bubbies: Record<string, Bubby>) {
        //   this.bubbies = bubbies;
    }
    public update() {
        super.update();
        // const randomX = Math.random() * 4 - 2; // Generates a number between -10 and 10
        // const randomY = Math.random() * 4 - 2; // Generates a number between -10 and 10
        //Bubbies seek and fight the nearest enemy
        this.target = null;
        if (this.phase === "bubby") {
            if (this.team === 'blue') {
                this.target = super.targetEnemy('red') as Bubby | Tower | Plant | null;
            } else if (this.team === 'red') {
                this.target = super.targetEnemy('blue') as Bubby | Tower | Plant | null;
            }
        }
        //hungry bubbies
        if (this.phase === "babyBubby" || this.health < MAX_HEALTH_BUBBY/2) {
            this.target = super.targetClosest(this.plants, 'plant', 'any', 'any');
            //if (this.health >= 20) {
            if (this.health >= MAX_HEALTH_BABYBUBBY) {
                this.phase = 'bubby';
                this.attackPower = 5;
                this.speed = 1.5;
                this.target = null;
            }
        }
        if (this.target) {
            const deltaX = this.target.x - this.x;
            const deltaY = this.target.y - this.y;
            const distanceToTarget = Math.sqrt(deltaX ** 2 + deltaY ** 2);
            if (distanceToTarget > 0) {
                // Calculate the unit vector toward the target
                const unitX = deltaX / distanceToTarget;
                const unitY = deltaY / distanceToTarget;
                // Move towards the target
                this.x += unitX * this.speed;
                this.y += unitY * this.speed;
            }
        //Idle
        } else {
            if (this.pauseDuration > 0) {
                // Bubby is currently paused, decrement pause duration
                this.pauseDuration -= 1;
            } else if (this.walkDuration > 0) {
                // Bubby is currently walking in a random direction
                this.x += this.walkingDirection.x * this.speed;
                this.y += this.walkingDirection.y * this.speed;
                this.walkDuration -= 1;
            } else {
                // Bubby needs a new random direction and duration
                this.randomizeDirectionAndDuration();
            }
        }
    }
}
