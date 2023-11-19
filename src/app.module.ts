import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game/game.gateway'; // Import GameGateway

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'), // Serve files from 'client' directory
    }),
 // Add WebSocketModule with configuration
    // ... (include other modules here if any)
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway], // Include GameGateway here
})
export class AppModule {}
