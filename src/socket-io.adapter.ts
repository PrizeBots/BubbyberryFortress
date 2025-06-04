import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        // Allow connections from any origin during development.
        // In production you may want to restrict this to specific domains.
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return server;
  }
}
