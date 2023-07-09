import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { configService } from 'apps/api/src/config/config.service';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserService } from '../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getValue('JWT_SECRET'),
      // passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    // const user = await this.userService.getUser(payload.sub);
    // const { password, ...returnUser } = user;
    // return returnUser;
    return payload;
  }
}
