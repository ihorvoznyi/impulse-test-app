import { Module } from '@nestjs/common';
import { CommonService } from './services/common.service';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      cache: true,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
