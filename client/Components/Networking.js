import io from 'socket.io-client';

export function initializeNetworking(player, players, updatePlayersList) {
    const port = process.env.PORT || 3000;
    const socket = io(`http://localhost:${port}`);
    socket.on('connect', () => {
        socket.emit('getPlayersList', { x: player.x, y: player.y });
    });
    socket.on('updatePlayersList', updatePlayersList);
    // Add other networking related functions and event handlers here
    return socket;
}
