import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ImpulseApiAdapter } from './impulse-adapter.service';
import { Environment } from 'src/configs';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      baseURL: Environment.IMPULSE_API,
      headers: {
        'x-api-key': Environment.IMPULSE_X_API_KEY,
      },
    }),
  ],
  providers: [ImpulseApiAdapter],
  exports: [ImpulseApiAdapter],
})
export class ImpulseApiAdapterModule {}
