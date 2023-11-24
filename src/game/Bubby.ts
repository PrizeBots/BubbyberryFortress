//Bubby.ts
import { Plant } from './Plant'; // Import the Plant class from the appropriate file
import { EventEmitter } from 'events'; // Import the EventEmitter

export class Bubby {
    private lastAttackTime: number = 0;
    private attackCooldown: number = 2000; // Adjust the attack cooldown time (in milliseconds)
    private emitter: EventEmitter = new EventEmitter(); // Initialize the EventEmitter

    constructor(
        public type: string,
        public x: number,
        public y: number,
        public team: 'blue' | 'red',
        public id: string,
        public phase: string,
        public maxHealth: number,
        public health: number = maxHealth,
        public speed: number = 2,
        public isUsedBy: string,
        public target: Plant | null,
        public collisionRadius: number,
        public attackPower: number,
        public plants: Record<string, Plant>, // Add this parameter

    ) {
        //egg hatch timer
        setTimeout(() => {
            if (this && this.phase === 'egg') {
                this.phase = 'babyBubby';
                this.health = 10;
                this.maxHealth = 10;
            }
        }, 4000)
        //death timer
        setTimeout(() => {
            //delete this.bubbies[this.id];
        }, 14000)


    }
    public setTargetPlant(plants: Record<string, Plant>) {
        if (this.phase === 'babyBubby') {
            let nearestPlant: Plant | null = null;
            let nearestDistance = Infinity;

            for (const plantId in plants) {
                const plant = plants[plantId];
                const distance = Math.sqrt((this.x - plant.x) ** 2 + (this.y - plant.y) ** 2);

                if (distance < nearestDistance) {
                    nearestPlant = plant;
                    nearestDistance = distance;
                }
            }
            this.target = nearestPlant;
        }
    }
    // Inside your Bubby class
    public handleCollision(object: Bubby | Plant) {
        if (object instanceof Bubby) {
            // Handle collision with another Bubby (make them bounce off)
            const dx = this.x - object.x;
            const dy = this.y - object.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            const overlap = (this.collisionRadius + object.collisionRadius) - distance;

            if (overlap > 0) {
                const moveX = (overlap / distance) * (dx / 2);
                const moveY = (overlap / distance) * (dy / 2);

                this.x += moveX;
                this.y += moveY;
            }
        } else if (object instanceof Plant) {
            // Handle collision with a Plant (attack and deplete HP)
            if (this.phase === 'babyBubby' && object.health > 0) {
                // Check if enough time has passed since the last attack
                const currentTime = Date.now();
                if (currentTime - this.lastAttackTime >= this.attackCooldown) {
                    // Reduce plant HP
                    object.health -= this.attackPower;
                    if (object.health <= 0) {
                        delete this.plants[object.id]; 
                    }
                    this.lastAttackTime = currentTime;
                }
            }
        }
    }

    public update() {
        const randomX = Math.random() * 4 - 2; // Generates a number between -10 and 10
        const randomY = Math.random() * 4 - 2; // Generates a number between -10 and 10
        if (this.phase === "babyBubby") {
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
            } else {
                this.x += randomX;
                this.y += randomY;
            }

        } else if (this.phase === 'egg') {
            if (this.y < 180) {
                this.y += 2;
            }
        }

    }
}
