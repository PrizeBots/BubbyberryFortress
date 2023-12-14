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
        public target: GameObject | null,
        public collisionRadius: number = 32,

        public attackPower: number,
        public lastAttackTime: number = 0,
        public attackCooldown: number = 1000,

        public shouldRemove: boolean = false,
        public isMovable: boolean = true,
    ) {

    }
    //set target
    public targetClosest(objects: Record<string, GameObject>, targetPhase: string) {
        let nearestObj: GameObject | null = null;
        let nearestDistance = Infinity;
        // console.log(nearestObj)
        for (const objID in objects) {
            const object = objects[objID];
            if (object.phase === targetPhase) {
                console.log('got one', targetPhase)
                const distance = Math.sqrt((this.x - object.x) ** 2 + (this.y - object.y) ** 2);
                if (distance < nearestDistance && distance < 400) {
                    nearestObj = object;
                    nearestDistance = distance;
                }
            }
        }
        return nearestObj;
    }

    public destroy() {
        this.shouldRemove = true;
      //  console.log('an obj has been marked for removal')

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
