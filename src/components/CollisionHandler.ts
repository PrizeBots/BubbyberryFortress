import { Bubby } from '../game/Bubby';
import { Plant } from '../game/Plant';
import { Tower } from '../game/Tower';
import { Bullet } from '../game/Bullet';
export class CollisionHandler {
  static objectsToRemove: (Plant | Bubby | Tower | Bullet)[] = [];
  //static objectsToRemove: any;
  constructor(
  ) {
  }

  public static handleCollisions(objects: (Bubby | Plant | Tower | Bullet)[]) {
    //  const objectsToRemove: Plant[] = [];
    for (const obj1 of objects) {
      for (const obj2 of objects) {
        if (obj1 !== obj2) {
          CollisionHandler.checkCollision(obj1, obj2);
        }
      }
    }
    for (const objToRemove of this.objectsToRemove) {
      //remove from type array
      if (objToRemove.type === 'plant') {

      }

      //remove from objects pool
      const index = objects.indexOf(objToRemove);
      if (index !== -1) {
        //console.log('remove from obj pool')
        objects.splice(index, 1);

      }
    }
  }
  private static checkCollision(obj1: Bubby | Plant | Tower | Bullet,
    obj2: Bubby | Plant | Tower | Bullet) {
    if (obj1 instanceof Bullet && obj2 instanceof Bubby) {
      console.log(obj1, 'HAS BEEN SHOT!')
    }

    if (obj1 instanceof Bubby && obj2 instanceof Plant) {
      const dx = obj1.x - obj2.x;
      const dy = obj1.y - obj2.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      const minDistance = obj1.collisionRadius + obj2.collisionRadius;
      if (distance < minDistance) {
        // Calculate the overlap amount
        const overlap = minDistance - distance;
        const overlapX = (overlap / distance) * dx;
        const overlapY = (overlap / distance) * dy;
        // Push the objects apart
        obj1.x += overlapX / 2;
        obj1.y += overlapY / 2;
        obj2.x -= overlapX / 2;
        obj2.y -= overlapY / 2;
        //Bubby eats plant
        if (obj1.phase === 'babyBubby' && obj2.health > 0) {
          const currentTime = Date.now();
          if (currentTime - obj1.lastAttackTime >= obj1.attackCooldown) {
            obj2.health -= obj1.attackPower;
            obj1.health += obj1.attackPower;
            //console.log('obj1 hp:', obj1.health);
            //console.log(' obj2 hp:', obj2.health);

            //bubby ate it!
            if (obj2.health <= 0) {
              this.objectsToRemove.push(obj2);
            }
            //Advance to bubby phase
            if (obj1.maxHealth >= 50) {
              // this.phase = 'bubby';
            }
            obj1.lastAttackTime = currentTime;
          }
        }
      }
    }
    // obj1.takeDamage(obj2.getDamage());
    // obj2.takeDamage(obj1.getDamage());
    else if (obj1 instanceof Bubby && obj2 instanceof Bullet) {
      // Handle collision between Bubby and Bullet
      // Example collision logic:
      // obj1.takeDamage(obj2.getDamage());
      // obj2.destroy();
    }

    else if (obj1 instanceof Bubby && obj2 instanceof Bubby) {
      const dx = obj1.x - obj2.x;
      const dy = obj1.y - obj2.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      const minDistance = obj1.collisionRadius + obj2.collisionRadius;

      if (distance < minDistance) {
        //  console.log('ooops bump time')
        // Calculate the overlap amount
        const overlap = minDistance - distance;
        const overlapX = (overlap / distance) * dx;
        const overlapY = (overlap / distance) * dy;

        // Push the objects apart
        obj1.x += overlapX / 2;
        obj1.y += overlapY / 2;

        // If the other object is also a Bubby, push it in the opposite direction
        if (obj1 instanceof Bubby) {
          obj2.x -= overlapX / 2;
          obj2.y -= overlapY / 2;
        }
      }
    }
  }
}
