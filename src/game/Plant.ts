//plants.ts

import { GameObject } from "./GameObject";

export class Plant extends GameObject {
    public plants: Record<string, Plant>
    constructor(
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
            false,
        );

        // ...

        //growth timer
        setTimeout(() => {
            // if (this && this.phase === 'seed') {
            //     this.phase = 'sprout';
            //     this.health = 25;
            //     this.maxHealth = 25;
            // }
        }, 4000)

    }

    public update() {
        super.update();

        if (this.phase === 'seed' || this.phase === 'germinating') {
            this.health += 1;
            if (this.health > this.maxHealth / 2) {
                this.phase = 'germinating';
            }
            if (this.health >= 30) {
                this.phase = 'sprout';
                this.maxHealth = 30;
            }
        }
        if (this.phase === 'sprout') {
            this.health += 1;
            if (this.health >= 50) {
                this.phase = 'babyBush';
                this.maxHealth = 50;
            }
        }
    }
}
