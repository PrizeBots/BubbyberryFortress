import io from 'socket.io-client';

export function initializeNetworking(player, players, updatePlayersList) {
    const socket = io('http://localhost:3000'); // Adjust the URL as needed
    console.log('!!!initializeNetworking!!!');
    socket.on('connect', () => {
        socket.emit('getPlayersList', { x: player.x, y: player.y });
        console.log('!!  socket.onconnect');
    });
    socket.on('updatePlayersList', updatePlayersList);
    // Add other networking related functions and event handlers here
    return socket;
}
