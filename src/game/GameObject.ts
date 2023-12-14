//GameObject.ts
// Import the Plant class from the appropriate file
export class GameObject {
    constructor(
        public type: string,
        public x: number,
        public y: number,

        public team: 'blue' | 'red',
        public id: string,
        public phase: string,

        public maxHealth: number,
        public health: number = maxHealth,
        public speed: number,

        public isUsedBy: string,
        public target: null,
        public collisionRadius: number = 32,

        public attackPower: number,
        public lastAttackTime: number = 0,
        public attackCooldown: number = 1000,
        public shouldRemove: boolean = false,
    ) {

    }
    //set target
    // public setTargetPlant(plants: Record<string, Plant>) {
    //     if (this.phase === 'babyBubby') {
    //         let nearestPlant: Plant | null = null;
    //         let nearestDistance = Infinity;
    //         for (const plantId in plants) {
    //             const plant = plants[plantId];
    //             const distance = Math.sqrt((this.x - plant.x) ** 2 + (this.y - plant.y) ** 2);
    //             if (distance < nearestDistance && distance < 400) {
    //                 nearestPlant = plant;
    //                 nearestDistance = distance;
    //             }
    //         }
    //         this.target = nearestPlant;
    //     }
    // }
    public destroy() {
        this.shouldRemove = true;

    }
    public update() {
        if (this.health <= 0) {
            this.destroy();
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
