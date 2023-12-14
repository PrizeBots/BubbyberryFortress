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
        /// console.log('remove from obj pool ', objects.indexOf(objToRemove));
        objects.splice(index, 1);
      }
    }
  }
  private static checkCollision(obj1: Bubby | Plant | Tower | Bullet,
    obj2: Bubby | Plant | Tower | Bullet) {
    //distance check
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    const minDistance = obj1.collisionRadius + obj2.collisionRadius;
    //collision check
    if (distance < minDistance) {
      const overlap = minDistance - distance;
      const overlapX = (overlap / distance) * dx;
      const overlapY = (overlap / distance) * dy;

      // Push the objects apart
      if (obj1.isMovable) {
        obj1.x += overlapX / 2;
        obj1.y += overlapY / 2;
      }
      if (obj2.isMovable) {
        obj2.x -= overlapX / 2;
        obj2.y -= overlapY / 2;
      }

      //Projectile hits a bubby, plant, or tower
      if (obj1 instanceof Bullet && obj2 instanceof Bubby || obj1 instanceof Bullet && obj2 instanceof Plant) {
        this.objectsToRemove.push(obj1);
        obj1.shouldRemove = true;
        if (obj1.team != obj2.team) {
          obj2.health -= obj1.attackPower;
          if (obj2.health <= 0) {
            this.objectsToRemove.push(obj2);
          }
        }
      }
      //    this.objectsToRemove.push(obj1);
      //Bubby eats plant
      else if (obj1 instanceof Bubby && obj2 instanceof Plant) {
        if (obj1.phase === 'babyBubby' && obj2.health > 0 && obj2.phase != 'germinating') {
          const currentTime = Date.now();
          if (currentTime - obj1.lastAttackTime >= obj1.attackCooldown) {
            obj2.health -= obj1.attackPower;
            obj1.health += obj1.attackPower;
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
      //Bubby fight
      else if (obj1 instanceof Bubby && obj2 instanceof Bubby) {
        if (obj1.team != obj2.team) {
          //team 1 attack!
          if (obj1.phase === 'bubby') {
            const currentTime = Date.now();
            if (currentTime - obj1.lastAttackTime >= obj1.attackCooldown) {
              obj2.health -= obj1.attackPower;
              obj1.lastAttackTime = currentTime;
              if (obj2.health <= 0) {
                this.objectsToRemove.push(obj2);
              }
            }
          } else if (obj2.phase === 'bubby') {
            const currentTime = Date.now();
            if (currentTime - obj2.lastAttackTime >= obj2.attackCooldown) {
              obj1.health -= obj2.attackPower;
              obj2.lastAttackTime = currentTime;
              if (obj1.health <= 0) {
                this.objectsToRemove.push(obj1);
              }
            }
          }
        }
      }
    }
  }
}
