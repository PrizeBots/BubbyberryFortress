import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './socket-io.adapter'; // Adjust the path accordingly

import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS and configure it to accept requests from your client domain
  app.enableCors({
    origin: 'https://bbf-client.onrender.com', // replace with your client's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 10000;
  console.log(`Using port: ${port}`);  // Log the port for verification

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap();
