// src/game/game.gateway.ts

import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Player {
    x: number;
    y: number;
    team: 'blue' | 'red'; // Add a team property to the Player interface
}

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private players: Record<string, Player> = {}; // Track players by their socket ID
    private teamCounts: Record<'blue' | 'red', number> = { blue: 0, red: 0 }; // Track team counts

    handleConnection(client: Socket) {
        const blueTeamCount = Object.values(this.players).filter((player) => player.team === 'blue').length;
    const redTeamCount = Object.values(this.players).filter((player) => player.team === 'red').length;
    const team = blueTeamCount <= redTeamCount ? 'blue' : 'red';
        // Add the new player to the list with the determined team
        this.players[client.id] = { x: 0, y: 0, team }; // Initialize with default position and team
        if (team === 'blue') {
            this.teamCounts.blue++;
        } else {
            this.teamCounts.red++;
        }
        this.server.to(client.id).emit('assignTeam', team); // Send team assignment only to the new client
        this.server.emit('updatePlayersList', this.players); // Send the updated player list to all clients
    

        client.on('mousemove', (data: { x: number; y: number }) => {
            // Update the player's position
            this.players[client.id] = { ...this.players[client.id], x: data.x, y: data.y };

            // Broadcast the player's movement
            client.broadcast.emit('playerMove', { id: client.id, x: data.x, y: data.y });
        });

        client.on('click', (data: { x: number; y: number }) => {
            // Handle the click event (if necessary)
        });
    }

    handleDisconnect(client: Socket) {
        // Get the team of the disconnecting player
        const team = this.players[client.id].team;

        // Decrement the team count for the disconnecting player's team
        this.teamCounts[team]--;

        // Broadcast the updated team counts to all clients
        this.server.emit('updateTeamCounts', this.teamCounts);

        // Broadcast the player disconnection to all clients
        this.server.emit('playerDisconnected', client.id);

        // Remove the player from the list
        delete this.players[client.id];
    }
}
