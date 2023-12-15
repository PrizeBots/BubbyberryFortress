//bullet.ts
import { Bubby } from './Bubby';
export class Bullet {
    private position: { x: number; y: number };
    private creationTime: number;
    private bulletLifetime: number;
    constructor(
        public type: string,
        public x: number,
        public y: number,
        public team: 'blue' | 'red',
        public id: string,
        public phase: string = 'ball',
        public speed: number,
        public target: Bubby | null,
        public attackPower: number,
        public direction: { x: number; y: number },
        public collisionRadius: number = 32,
        public shouldRemove: boolean,
        public isMovable: boolean = true,
        
        public collisionCooldown: number = 1000,
        public lastCollisionTime: number = 0,
    ) {
        this.creationTime = Date.now();

        setInterval(() => {
            shouldRemove = true;
        }, 1000);
    }
    public test() {
        //console.log('bullet test');
    }
    public destroy() {
        this.shouldRemove = true;

    }


    public update() {

        const currentTime = Date.now();
        const deltaTime = (currentTime - this.creationTime) / 1000; // Convert milliseconds to seconds

        this.x += this.direction.x * this.speed * deltaTime;
        this.y += this.direction.y * this.speed * deltaTime;
        ///    console.log('x: ', this.x,'y: ', this.y);
        // Boundaries
        if (this.y <= 0) {
            this.destroy();
        } else if (this.y >= 580) {
            this.destroy();
        }
        if (this.x <= 0) {
            this.destroy();
        } else if (this.x >= 3093) {
            this.destroy();
        }

    }


}
