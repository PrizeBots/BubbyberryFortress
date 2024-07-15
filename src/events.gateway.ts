import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Your gateway logic here
}
