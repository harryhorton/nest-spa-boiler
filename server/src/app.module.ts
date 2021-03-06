import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DbModule } from './db.module';
import { HooksModule } from './hooks/hooks.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    DbModule(),
    AuthModule,
    UserModule,
    ConfigModule.register({ folder: './config' }),
    HooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
