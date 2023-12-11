//bullet.ts
import { Bubby } from './Bubby';
export class Bullet {
    private position: { x: number; y: number };
    private creationTime: number;

    // constructor(x: number, y: number, phase: string, direction: { x: number; y: number }, speed: number) {
    //     // const bulletID = `bullet${playerId}_${this.bulletsSpawned++}`;
    //     this.position = { x, y };
    //     this.direction = direction;
    //     this.speed = speed;
    //     this.creationTime = Date.now();
        
    // }
    constructor(
        public type: string,
        public x: number,
        public y: number,
        public team: 'blue' | 'red',
        public id: string = 'bulletIDcause i dont have one',
        public phase: string,
        public speed: number = 1,
        public isUsedBy: string,
        public target: Bubby | null,
        public attackPower: number,
        public bubbies: Record<string, Bubby>, // Add this parameter
        public direction: { x: number; y: number },
        public collisionRadius: number = 32,
        public shouldRemove: boolean,


    ) {

    }
    public destroy(){
        
    }
    public update() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.creationTime) / 1000; // Convert milliseconds to seconds

        this.x += this.direction.x * this.speed * deltaTime;
        this.y += this.direction.y * this.speed * deltaTime;
    }

    public isExpired() {
        // Define a lifetime for bullets (e.g., 5 seconds)
        const bulletLifetime = 5; // seconds
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.creationTime) / 1000; // Convert milliseconds to seconds

        return deltaTime >= bulletLifetime;
    }
}
