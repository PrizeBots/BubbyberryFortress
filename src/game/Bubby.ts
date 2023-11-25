//Bubby.ts
import { Plant } from './Plant'; // Import the Plant class from the appropriate file

export class Bubby {
    private lastAttackTime: number = 0;
    private attackCooldown: number = 2000; // Adjust the attack cooldown time (in milliseconds)
    private walkingDirection: { x: number, y: number } = { x: 0, y: 0 };
    private walkDuration: number = 0;
    private pauseDuration: number = 0;
    private babyBubbyWidth: number = 16;
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
                this.collisionRadius = this.babyBubbyWidth;
            }
        }, 1000)
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
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const minDistance = this.collisionRadius + object.collisionRadius;

        if (distance < minDistance) {
            // Calculate the overlap amount
            const overlap = minDistance - distance;
            const overlapX = (overlap / distance) * dx;
            const overlapY = (overlap / distance) * dy;

            // Push the objects apart
            this.x += overlapX / 2;
            this.y += overlapY / 2;

            // If the other object is also a Bubby, push it in the opposite direction
            if (object instanceof Bubby) {
                object.x -= overlapX / 2;
                object.y -= overlapY / 2;
            }
        }
        if (distance <= object.collisionRadius *2) {
            if (object instanceof Plant) {
                // Handle collision with a Plant (attack and deplete HP)
                if (this.phase === 'babyBubby' && object.health > 0) {
                    console.log('eating!')
                    // Check if enough time has passed since the last attack
                    const currentTime = Date.now();
                    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
                        // Reduce plant HP
                        object.health -= this.attackPower;
                        this.health += 1;
                        if (object.health <= 0) {
                            setTimeout(() => {
                                delete this.plants[object.id];
                            }, 1000)
                        }
                        //Advance to bubby phase
                        if (this.maxHealth >= 50) {
                            // this.phase = 'bubby';
                        }
                        this.lastAttackTime = currentTime;
                    }
                }
            }
        }
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
    public update() {
        if (this.health <= 0) {
            return;
        }

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
                //wander waddle around as cutely as possible
                // this.x += randomX;
                // this.y += randomY;


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

        } else if (this.phase === 'egg') {

        }
        if (this.y <= 180) {
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
