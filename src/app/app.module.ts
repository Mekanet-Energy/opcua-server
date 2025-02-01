import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Variable } from './entity/variable.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(__dirname, '..', 'data', 'database.sqlite'),
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Variable]),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
