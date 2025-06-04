import Bubby from './Bubby';
import Plant from './Plant';
import Tower from './Tower';
<<<<<<< HEAD
import Projectile from './Projectile';
=======
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
class SocketManager {
    constructor(game) {
        this.game = game;
        this.socket = game.socket;
        this.registerSocketEvents();
    }
    registerSocketEvents() {
        //Player Setup
        this.socket.on('connect', () => {
            this.socket.emit('getPlayersList', { x: this.game.player.x, y: this.game.player.y });
        });
        this.socket.on('initialize', (data) => {
            const team = data.team;
            let coins = data.coins;
            const circleColor = team === 'blue' ? 0x0000ff : 0xff0000;
            this.game.player = this.game.add.circle(400, 300, 10, circleColor);
            this.game.player.playerId = this.socket.id;
            this.game.player.team = team;
            this.game.player.coins = coins;
            this.game.players[this.socket.id] = this.game.player;
            this.game.scene.get('HUD').events.emit('updateCoins', coins);
        });

        //Player controls
        this.socket.on('bubbyControlGranted', ({ bubbyId, clientId }) => {
            // Check if the granted control is for a bubby controlled by this client
            const bubby = this.game.bubbies.find((b) => b.id === bubbyId);
        });
        this.socket.on('controlRequestRejected', (bubbyId) => {
            console.log("YOU CANT TOUCH THIS RIGHT NOW!")
        });
        this.socket.on('updateCoins', (coins) => {
            this.game.scene.get('HUD').events.emit('updateCoins', coins);
        });

<<<<<<< HEAD
        this.socket.on('updateObjects', (update) => {
            console.log(update)
        });

        //Create new object
        this.socket.on('spawnEgg', (newEgg) => {
            const newBubby = new Bubby(this.game, newEgg.ownerName, newEgg.team, newEgg.id, newEgg.x, newEgg.y, 'egg', newEgg.maxHealth);
=======
        //Create new object
        this.socket.on('spawnEgg', (newEgg) => {
            const newBubby = new Bubby(this.game, newEgg.team, newEgg.id, newEgg.x, newEgg.y, 'egg', newEgg.maxHealth);
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
        });
        this.socket.on('spawnSeed', (newSeed) => {
            const newPlant = new Plant(this.game, newSeed.team, newSeed.id, newSeed.x, newSeed.y, 'seed', newSeed.maxHealth);
        });
        this.socket.on('buildTower', (newTower) => {
<<<<<<< HEAD
            //console.log('newTower.team ', newTower.team, "newTower.id ",newTower.id )
            const newArrowTower = new Tower(this.game, newTower.team, newTower.id, newTower.x, newTower.y, 'tower', newTower.maxHealth);
        });
        this.socket.on('towerShot', (shot) => {
          //console.log('new shot!',shot.team, shot.x, ' ',shot.y)
            const projectile = new Projectile(this.game, shot.x, shot.y, shot.phase, shot.team, shot.id);
        });
        //Game Server Updates
        this.socket.on('updateProjectiles', (projectiles) => {
            const serverProjectileIDs = new Set(Object.keys(projectiles));
            // Iterate through the client's projectiles
            for (let i = this.game.projectiles.length - 1; i >= 0; i--) {
                const projectile = this.game.projectiles[i];
                
                // Check if the projectile's ID is not in the server's updated array
                if (!serverProjectileIDs.has(projectile.id)) {
                    // The projectile is not in the updated array, so remove it
                    projectile.destroy();
                    this.game.projectiles.splice(i, 1); // Remove it from the client's array
                }
            }
            // let i =1;
            for (const projectileID in projectiles) {
                if (projectiles.hasOwnProperty(projectileID)) {
                    const updatedProjectile = projectiles[projectileID];
                    const projectile = this.game.projectiles.find((p) => p.id === projectileID);
                    if (projectile) {
                 //       console.log('updatedProjectile x y: ',updatedProjectile.team)
                        projectile.x = updatedProjectile.x;
                        projectile.y = updatedProjectile.y;
                    } else {
                   //     console.log('make new one')
                        const projectile = new Projectile(this.game, updatedProjectile.x, updatedProjectile.y, updatedProjectile.phase,updatedProjectile.team, updatedProjectile.id);
                    }
                }
            }
        });

=======
            const newArrowTower = new Tower(this.game, newTower.team, newTower.id, newTower.x, newTower.y, 'tower', newTower.maxHealth);
        });
        this.socket.on('arrowUpdate', (arrow) => {
            console.log('arrow update: ', arrow)
            ///const newArrowTower = new Tower(this.game, newTower.team, newTower.id, newTower.x, newTower.y, 'tower', newTower.maxHealth);
        });
        //Game Server Updates
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
        this.socket.on('updatePlayersList', (playerList) => {
            for (const playerId in playerList) {
                if (!this.game.players[playerId]) {
                    const { x, y, team } = playerList[playerId];
                    const circleColor = team === 'blue' ? 0x0000ff : 0xff0000;
                    const otherPlayer = this.game.add.circle(x, y, 10, circleColor);
                    otherPlayer.playerId = playerId;
                    otherPlayer.team = team;
                    this.game.players[playerId] = otherPlayer;
                }
            }
        });
<<<<<<< HEAD
        this.socket.on('updateBubbies', (bubbiesList) => {
            const serverBubbyIDs = new Set(Object.keys(bubbiesList));
            // Iterate through the client's projectiles
            for (let i = this.game.bubbies.length - 1; i >= 0; i--) {
                const bubby = this.game.bubbies[i];
                
                // Check if the projectile's ID is not in the server's updated array
                if (!serverBubbyIDs.has(bubby.id)) {
                    // The projectile is not in the updated array, so remove it
                    bubby.destroy();
                    this.game.bubbies.splice(i, 1); // Remove it from the client's array
                }
            }

            // console.log('update bubbies')
=======
        this.socket.on('updateBubbiesList', (bubbiesList) => {
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
            for (const bubbyID in bubbiesList) {
                if (bubbiesList.hasOwnProperty(bubbyID)) {
                    const updatedBubby = bubbiesList[bubbyID];
                    const bubby = this.game.bubbies.find((b) => b.id === bubbyID);
                    if (bubby) {
                        bubby.x = updatedBubby.x;
                        bubby.y = updatedBubby.y;
                        bubby.updateHealth(updatedBubby.health);
<<<<<<< HEAD
                      //  console.log('hp: ',updatedBubby.health)
=======
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
                        //catch a phase change
                        if (bubby.phase !== updatedBubby.phase) {
                            bubby.phase = updatedBubby.phase;
                            if (bubby.phase === 'egg') {
                                bubby.changePhase('egg');
                            } else if (bubby.phase === 'babyBubby') {
                                bubby.changePhase('babyBubby');
<<<<<<< HEAD
                            }else if (bubby.phase === 'bubby') {
                                bubby.changePhase('bubby');
                            }
                        }
                    } else {
                       // console.log("bubby doesnt exist in your client list. Adding it now.")
                        const newBubby = new Bubby(this.game, updatedBubby.ownerName, updatedBubby.team, bubbyID, updatedBubby.x, updatedBubby.y, updatedBubby.phase, updatedBubby.maxHealth);
=======
                            }
                        }
                    } else {
                        const newBubby = new Bubby(this.game, updatedBubby.team, bubbyID, updatedBubby.x, updatedBubby.y, updatedBubby.phase, updatedBubby.maxHealth);
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
                    }
                }
            }
        });
        this.socket.on('updatePlants', (plants) => {
            for (const plantID in plants) {
                if (plants.hasOwnProperty(plantID)) {
                    const updatedPlant = plants[plantID];
                    const plant = this.game.plants.find((p) => p.id === plantID);
<<<<<<< HEAD
                    if (plant && updatedPlant) {
=======
                    if (plant) {
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
                        plant.x = updatedPlant.x;
                        plant.y = updatedPlant.y;
                        // console.log(updatedPlant.health)
                        plant.updateHealth(updatedPlant.health);
                        if (updatedPlant.health <= 0) {
                            plant.destroy();
                            return;
                        }
                        //catch a phase change
                        if (plant.phase !== updatedPlant.phase) {
                            plant.phase = updatedPlant.phase;
<<<<<<< HEAD
                            if (plant.phase === 'germinating') {
                                plant.changePhase('germinating');
                            } else if (plant.phase === 'sprout') {
                                plant.changePhase('sprout');
                            }else if (plant.phase === 'babyBush') {
                                plant.changePhase('babyBush');
                            }else if (plant.phase === 'bush') {
                                plant.changePhase('bush');
                            }
                        }
                    } else {
                       // console.log("i didnt have this plant, making it now")
                      //  console.log(updatedPlant)
                        const newPlant = new Plant(this.game, updatedPlant.team, plantID,
                            updatedPlant.x, updatedPlant.y, updatedPlant.phase, updatedPlant.maxHealth);
=======
                            if (plant.phase === 'egg') {
                                plant.changePhase('egg');
                            } else if (plant.phase === 'babyBubby') {
                                plant.changePhase('babyBubby');
                            }
                        }
                    } else {
                        // console.log("i didnt have this plant, making it now")
                        const newPlant = new Plant(this.game, updatedPlant.team, plantID, updatedPlant.x, updatedPlant.y, updatedPlant.phase, updatedPlant.maxHealth);
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
                    }
                }
            }
        });
        this.socket.on('updateTowers', (towers) => {
            for (const towerID in towers) {
                if (towers.hasOwnProperty(towerID)) {
<<<<<<< HEAD
                    const updatedTower = towers[towerID];
                    const tower = this.game.towers.find((t) => t.id === towerID);
                    if (tower) {
                        ///console.log(' tower team: ', updatedTower.team, ' target: ' , updatedTower.target)
                        tower.x = updatedTower.x;
                        tower.y = updatedTower.y;
                        tower.target = updatedTower.target;
                        ///console.log(tower.target, ' is the target')
=======
                    const updatedTower= towers[towerID];
                    const tower = this.game.towers.find((t) => t.id === towerID);
                    if (tower) {
                        tower.x = updatedTower.x;
                        tower.y = updatedTower.y;
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
                        // console.log(updatedPlant.health)
                        tower.updateHealth(updatedTower.health);
                        if (updatedTower.health <= 0) {
                            tower.destroy();
                            return;
                        }
                        //catch a phase change
<<<<<<< HEAD
                        // if (tower.phase !== updatedTower.phase) {
                        //     tower.phase = updatedTower.phase;
                        //     if (tower.phase === 'egg') {
                        //         tower.changePhase('egg');
                        //     } else if (plant.phase === 'babyBubby') {
                        //         tower.changePhase('babyBubby');
                        //     }
                        // }
                    } else {
                        //   console.log("i didnt have this Tower, making it now")
=======
                        if (tower.phase !== updatedTower.phase) {
                            tower.phase = updatedTower.phase;
                            if (tower.phase === 'egg') {
                                tower.changePhase('egg');
                            } else if (plant.phase === 'babyBubby') {
                                tower.changePhase('babyBubby');
                            }
                        }
                    } else {
                        // console.log("i didnt have this plant, making it now")
>>>>>>> f94b2b8cf1600d6e917f8fb4d3044b83e4ca4c9e
                        const newTower = new Tower(this.game, updatedTower.team, towerID, updatedTower.x, updatedTower.y, updatedTower.phase, updatedTower.maxHealth);
                    }
                }
            }
        });
    }
}
export default SocketManager;
