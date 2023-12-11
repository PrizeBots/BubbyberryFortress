import Bubby from './Bubby';
import Plant from './Plant';
import Tower from './Tower';
import Projectile from './Projectile';
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

        this.socket.on('updateObjects', (update) => {
            console.log(update)
        });

        //Create new object
        this.socket.on('spawnEgg', (newEgg) => {
            const newBubby = new Bubby(this.game, newEgg.team, newEgg.id, newEgg.x, newEgg.y, 'egg', newEgg.maxHealth);
        });
        this.socket.on('spawnSeed', (newSeed) => {
            const newPlant = new Plant(this.game, newSeed.team, newSeed.id, newSeed.x, newSeed.y, 'seed', newSeed.maxHealth);
        });
        this.socket.on('buildTower', (newTower) => {
            //console.log('newTower.team ', newTower.team, "newTower.id ",newTower.id )

            const newArrowTower = new Tower(this.game, newTower.team, newTower.id, newTower.x, newTower.y, 'tower', newTower.maxHealth);
        });
        this.socket.on('towerShot', (shot) => {
            const projectile = new Projectile(this.game, shot.x, shot.y, shot.phase);
        });
        //Game Server Updates
        this.socket.on('updateBullets', (bullets) => {
          //  console.log(bullets)
            // for (const projectile in this.scene.projectiles) {
            //     if (!this.game.projectiles[projectile]) {
            //         console.log('need to make some projectiles')
            //         //   const { x, y, team } = playerList[playerId];

            //     }
            // }
        });
        // if (bubbiesList.hasOwnProperty(bubbyID)) {
        //     const updatedBubby = bubbiesList[bubbyID];
        //     const bubby = this.game.bubbies.find((b) => b.id === bubbyID);
        //     if (bubby) {
        //         bubby.x = updatedBubby.x;
        //         bubby.y = updatedBubby.y;
        //         bubby.updateHealth(updatedBubby.health);
        //         //catch a phase change
        //         if (bubby.phase !== updatedBubby.phase) {
        //             bubby.phase = updatedBubby.phase;
        //             if (bubby.phase === 'egg') {
        //                 bubby.changePhase('egg');
        //             } else if (bubby.phase === 'babyBubby') {
        //                 bubby.changePhase('babyBubby');
        //             }
        //         }
        //     } else {
        //         const projectile = new Projectile(this.game, shot.x, shot.y, shot.phase);
        //     }
        // }

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
        this.socket.on('updateBubbies', (bubbiesList) => {
           // console.log('update bubbies')
            for (const bubbyID in bubbiesList) {
                if (bubbiesList.hasOwnProperty(bubbyID)) {
                    const updatedBubby = bubbiesList[bubbyID];
                    const bubby = this.game.bubbies.find((b) => b.id === bubbyID);
                    if (bubby) {
                        bubby.x = updatedBubby.x;
                        bubby.y = updatedBubby.y;
                        bubby.updateHealth(updatedBubby.health);
                        //catch a phase change
                        if (bubby.phase !== updatedBubby.phase) {
                            bubby.phase = updatedBubby.phase;
                            if (bubby.phase === 'egg') {
                                bubby.changePhase('egg');
                            } else if (bubby.phase === 'babyBubby') {
                                bubby.changePhase('babyBubby');
                            }
                        }
                    } else {
                        const newBubby = new Bubby(this.game, updatedBubby.team, bubbyID, updatedBubby.x, updatedBubby.y, updatedBubby.phase, updatedBubby.maxHealth);
                    }
                }
            }
        });
        this.socket.on('updatePlants', (plants) => {
            for (const plantID in plants) {
                if (plants.hasOwnProperty(plantID)) {
                    const updatedPlant = plants[plantID];
                    const plant = this.game.plants.find((p) => p.id === plantID);
                    if (plant && updatedPlant) {
                        plant.x = updatedPlant.x;
                        plant.y = updatedPlant.y;
                        // console.log(updatedPlant.health)
                        plant.updateHealth(updatedPlant.health);
                        if (updatedPlant.health <= 0) {
                            plant.destroy();
                            return;
                        }
                        //catch a phase change
                        // if (plant.phase !== updatedPlant.phase) {
                        //     plant.phase = updatedPlant.phase;
                        //     if (plant.phase === 'egg') {
                        //         plant.changePhase('egg');
                        //     } else if (plant.phase === 'babyBubby') {
                        //         plant.changePhase('babyBubby');
                        //     }
                        // }
                    } else {
                        console.log("i didnt have this plant, making it now")
                        console.log(updatedPlant)
                        const newPlant = new Plant(this.game, updatedPlant.team, plantID, 
                            updatedPlant.x, updatedPlant.y, updatedPlant.phase, updatedPlant.maxHealth);
                    }
                }
            }
        });
        this.socket.on('updateTowers', (towers) => {
            for (const towerID in towers) {
                if (towers.hasOwnProperty(towerID)) {
                    const updatedTower = towers[towerID];
                    const tower = this.game.towers.find((t) => t.id === towerID);
                    if (tower) {
                        ///console.log(' tower team: ', updatedTower.team, ' target: ' , updatedTower.target)
                        tower.x = updatedTower.x;
                        tower.y = updatedTower.y;
                        tower.target = updatedTower.target;
                        // console.log(updatedPlant.health)
                        tower.updateHealth(updatedTower.health);
                        if (updatedTower.health <= 0) {
                            tower.destroy();
                            return;
                        }
                        //catch a phase change
                        if (tower.phase !== updatedTower.phase) {
                            tower.phase = updatedTower.phase;
                            if (tower.phase === 'egg') {
                                tower.changePhase('egg');
                            } else if (plant.phase === 'babyBubby') {
                                tower.changePhase('babyBubby');
                            }
                        }
                    } else {
                        console.log("i didnt have this Tower, making it now")
                        const newTower = new Tower(this.game, updatedTower.team, towerID, updatedTower.x, updatedTower.y, updatedTower.phase, updatedTower.maxHealth);
                    }
                }
            }
        });
    }
}
export default SocketManager;
