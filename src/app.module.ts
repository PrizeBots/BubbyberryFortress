import { Module, Controller, Get } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game/game.gateway'; // Import GameGateway

// Add a controller for the root endpoint
@Controller()
class HealthCheckController {
  @Get('/')
  getRoot() {
    return { status: 'ok', message: 'Server is running!' };
  }
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'), // Serve files from 'client' directory
    }),
    // Other imports if needed
  ],
  controllers: [AppController, HealthCheckController], // Add the new controller here
  providers: [AppService, GameGateway], // Include GameGateway here
})
export class AppModule {}
