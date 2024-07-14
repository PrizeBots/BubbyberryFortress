import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Serve static files from the 'dist' directory
  app.use(express.static(join(__dirname, '..', 'dist')));

  // Use the PORT environment variable or default to 3000
  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
