import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('firebase')
@ApiTags('Firebase')
@ApiBearerAuth('Authorization')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) { }

  @Public()
  @Get('/ping')
  async ping(): Promise<string> {
    return "pong";
  }

  @Public()
  @Get('/secure/ping')
  async securePing(): Promise<string> {
    return "Doooooooooooo";
  }
}
