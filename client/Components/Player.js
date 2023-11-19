export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.players = {};
    }

    createPlayer(id, x, y, team) {
        const circleColor = team === 'blue' ? 0x0000ff : 0xff0000;
        const player = this.scene.add.circle(x, y, 10, circleColor);
        player.playerId = id;
        player.team = team;
        this.players[id] = player;
        return player;
    }

    updatePlayerPosition(id, x, y) {
        if (this.players[id]) {
            this.players[id].x = x;
            this.players[id].y = y;
        }
    }

    removePlayer(id) {
        if (this.players[id]) {
            this.players[id].destroy();
            delete this.players[id];
        }
    }
}
