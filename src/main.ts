import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Serve static files from the 'dist' directory
  app.use(express.static(join(__dirname, '..', 'dist')));

  // Use the PORT environment variable or default to 3000
  const port = process.env.PORT || 3000;
  app.use(cors({
    origin: 'https://bbf-client.onrender.com', // Replace with your client app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  // Bind to 0.0.0.0 to make the server accessible from outside
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
