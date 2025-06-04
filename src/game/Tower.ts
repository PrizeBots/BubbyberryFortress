// Tower.ts
import { Bubby } from './Bubby';
import { Plant } from './Plant';
import { eventBus } from '../components/EventBus';
export class Tower {
    private lastAttackTime: number = 0;
    private bulletSpeed: number = 1;
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
        public target: Bubby | null,
        public collisionRadius: number,
        public attackPower: number,
        public bubbies: Record<string, Bubby>,
        public updateReady: boolean,
        public ammo: number,
        public shouldRemove: boolean,
        public isMovable: boolean = false,
        public collisionCooldown: number = 1000,
        public lastCollisionTime: number = 0,
    ) {
        setInterval(() => {
            if (this.target && this.ammo > 0) {
                this.shoot();
            }
        }, 1000);
    }

    public setTargetBubby(Bubbies: Record<string, Bubby>) {
        let nearestBubby: Bubby | null = null;
        let nearestDistance = Infinity;
        for (const BubbyID in Bubbies) {
            const bubby = Bubbies[BubbyID];
            const distance = Math.sqrt((this.x - bubby.x) ** 2 + (this.y - bubby.y) ** 2);
            if (bubby.team !== this.team && distance < nearestDistance && distance < 400) {
                nearestBubby = bubby;
                nearestDistance = distance;
            }
        }
        this.target = nearestBubby;
    }

    public update() {
        this.setTargetBubby(this.bubbies);
    }

    private shoot() {
        if (this.target && this.ammo > 0) {
            this.ammo--;
            const shotDirection = { x: this.target.x - this.x, y: this.target.y - this.y };
            this.attackPower = 5;
            eventBus.emit('towerShot', {
                id: this.id,
                team: this.team,
                attack: this.attackPower,
                speed: 0.1,
                x: this.x,
                y: this.y,
                shotDirection,
                phase: 'ball',
            });
        }
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
            '', //used by player ID
            null, //target
            babyBubbyWidth, // Set initial collision radius
            1, // Set initial attack power (you can adjust this as needed)
            bubbies,
            false, // Set initial updateReady flag (modify as needed)
            10000, //ammo
            false,
        );
    }
}