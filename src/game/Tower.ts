// Tower.ts
import { Bubby } from './Bubby';
import { Plant } from './Plant';
export class Tower {
    private lastAttackTime: number = 0;
    private attackCooldown: number = 2000;
    private walkingDirection: { x: number, y: number } = { x: 0, y: 0 };
    private walkDuration: number = 0;
    private pauseDuration: number = 0;
    private babyBubbyWidth: number = 16;
    private shooting: boolean = false;
    private arrowCooldown: number = 1000; // Adjust the arrow cooldown time (in milliseconds)
    private lastArrowTime: number = 0;
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
        public plants: Record<string, Plant>,
        public updateReady: boolean,
        public ammo: number,
    ) {
        setTimeout(() => {
            if (this.target){
                this.shooting = true;
                this.ammo=-1;
            }
        }, 14000);
    }

    public setTargetBubby(Bubbies: Record<string, Bubby>) {
        if (this.phase === 'arrow') {
            let nearestBubby: Bubby | null = null;
            let nearestDistance = Infinity;
            for (const BubbyID in Bubbies) {
                const bubby = Bubbies[BubbyID];
                const distance = Math.sqrt((this.x - bubby.x) ** 2 + (this.y - bubby.y) ** 2);
                if (distance < nearestDistance && distance < 400) {
                    nearestBubby = bubby;
                    nearestDistance = distance;
                }
            }
            this.target = nearestBubby;
        }
    }

    public update() {
     
    }

    // Static factory method for creating a Bubby instance
    public static createTower(
        x: number,
        y: number,
        team: 'blue' | 'red',
        id: string,
        phase: string,
        maxHealth: number,
        bubbies: Record<string, Bubby>
    ): Tower {
        const babyBubbyWidth = 16;
        return new Tower(
            'Tower',
            x,
            y,
            team,
            id,
            phase,
            maxHealth,
            maxHealth, // Set initial health to maxHealth
            1, // Set initial speed (you can adjust this as needed)
            '',
            null,
            babyBubbyWidth, // Set initial collision radius
            1, // Set initial attack power (you can adjust this as needed)
            bubbies,
            false, // Set initial updateReady flag (modify as needed)
            10,
        );
    }
}