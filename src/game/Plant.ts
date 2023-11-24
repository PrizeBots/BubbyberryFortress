//plants.ts

export class Plant implements Plant {
    constructor(
        public type:string,
        public x: number,
        public y: number,
        public team: 'blue' | 'red',
        public id: string,
        public phase: string,
        public maxHealth: number = 5,
        public health: number = maxHealth,
        public isUsedBy: string,
        public collisionRadius: number,
    ) {
         //egg hatch timer
         setTimeout(() => {
            // if (this && this.phase === 'seed') {
            //     this.phase = 'sprout';
            //     this.health = 25;
            //     this.maxHealth = 25;
            // }
        }, 4000)


        //death timer
        setTimeout(() => {
            //delete this.bubbies[this.id];
        }, 14000)
    }

    public update() {
       //plant life
       if(this.y < 180){
        this.y += 2;
    }
        
    }
}
