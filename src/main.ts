import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.use(cors({
    origin: 'https://bbf-client.onrender.com', // Replace with your client app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);
}
bootstrap();
