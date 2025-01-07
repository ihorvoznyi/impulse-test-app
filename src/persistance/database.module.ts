import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { AppDataSource } from './data-source';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  providers: [],
})
export class DatabaseModule {
  public static forFeature(entities?: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
