//Bubby.ts
import { Plant } from './Plant';
import { Bullet } from './Bullet'; // Import the Plant class from the appropriate file
export class Bubby {
  // Adjust the attack cooldown time (in milliseconds)
    private walkingDirection: { x: number, y: number } = { x: 0, y: 0 };
    private walkDuration: number = 0;
    private pauseDuration: number = 0;
    private babyBubbyWidth: number = 16;
    private lastKnownState: Partial<Bubby> = {}; // Store the last known state

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
        public target: Plant | null,
        public collisionRadius: number = 32,
        public attackPower: number,
        public plants: Record<string, Plant>, // Add this parameter
        public lastAttackTime: number = 0,
        public attackCooldown: number = 1000,
        public shouldRemove: boolean,

    ) {
        //egg hatch timer
        setTimeout(() => {
            if (this && this.phase === 'egg') {
                this.phase = 'babyBubby';
                this.health = 10;
                this.maxHealth = 10;
                this.collisionRadius = this.babyBubbyWidth;
            }
        }, 1000)
        //death timer
        // setTimeout(() => {
        // delete this;
        // }, 14000)
    }
    public setTargetPlant(plants: Record<string, Plant>) {
        if (this.phase === 'babyBubby') {
            let nearestPlant: Plant | null = null;
            let nearestDistance = Infinity;
            for (const plantId in plants) {
                const plant = plants[plantId];
                const distance = Math.sqrt((this.x - plant.x) ** 2 + (this.y - plant.y) ** 2);
                if (distance < nearestDistance && distance < 400) {
                    nearestPlant = plant;
                    nearestDistance = distance;
                }
            }
            this.target = nearestPlant;
        }
    }
    public destroy(){
        
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

        // Add more properties to compare as needed

        // Update the last known state with the current values
        this.lastKnownState = { ...this };

        return updates;
    }
    public update() {
        if (this.health <= 0) {
            return;
        }
        this.setTargetPlant(this.plants);
        const randomX = Math.random() * 4 - 2; // Generates a number between -10 and 10
        const randomY = Math.random() * 4 - 2; // Generates a number between -10 and 10
        if (this.phase === "babyBubby") {
            if (this.target) {
                const deltaX = this.target.x - this.x;
                const deltaY = this.target.y - this.y;
                const distanceToTarget = Math.sqrt(deltaX ** 2 + deltaY ** 2);
               // console.log('bubby target')
                if (distanceToTarget > 0) {
                    //console.log('bubby moving to target')
                    // Calculate the unit vector toward the target
                    const unitX = deltaX / distanceToTarget;
                    const unitY = deltaY / distanceToTarget;
                    // Move towards the target
                    this.x += unitX * this.speed;
                    this.y += unitY * this.speed;
                }
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
        //Boundaries
        if (this.y <= 200) {
            this.y += 5;
        } else if (this.y >= 580) {
            this.y -= 5;
        }
        if (this.x <= 0) {
            this.x += 5;
        } else if (this.x >= 3093) {
            this.x -= 5;
        }
    }
}
