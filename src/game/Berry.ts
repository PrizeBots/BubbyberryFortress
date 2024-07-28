//bullet.ts
import { Bubby } from './Bubby';
import { GameObject } from './GameObject';
export class Berry extends GameObject {
    private position: { x: number; y: number };
    private creationTime: number;
    private bulletLifetime: number;
 
    constructor(
        public ownerName: string,

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
            ownerName,
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

            false, // Remove
            true, // isMoveable
        );
    }
    public update() {

    

    }


}
