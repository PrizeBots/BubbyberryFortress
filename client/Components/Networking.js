import io from 'socket.io-client';

export function initializeNetworking(player, players, updatePlayersList) {
    const socket = io('http://localhost:10000'); // Adjust the URL as needed
    socket.on('connect', () => {
        socket.emit('getPlayersList', { x: player.x, y: player.y });
    });
    socket.on('updatePlayersList', updatePlayersList);
    // Add other networking related functions and event handlers here
    return socket;
}
