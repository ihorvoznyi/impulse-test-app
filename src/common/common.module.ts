import { Module } from '@nestjs/common';
import { CommonService } from './services/common.service';
import { DatabaseModule } from 'src/persistance';

@Module({
  imports: [DatabaseModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
