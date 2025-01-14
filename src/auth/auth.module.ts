import { Module,forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
    imports: [
        forwardRef(() =>UserModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'T!@!8934',
          signOptions: { expiresIn: '360000000000s' }
        })
      ],
      controllers: [],
      providers: [ JwtStrategy,AuthService],
      exports:[AuthService]
})
export class AuthModule {}
