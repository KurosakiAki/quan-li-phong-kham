import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity'
import { passwordService } from '../../common/services/password.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) { }

  generateJWT(user: User) {
    const payload = { username: user.username, id: user.id, userRoleCode: user.userRoleCode };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(data: LoginDto) {
    const user = await this.userService.getUserByUsername(data.username);
    if (data.role === 'PATIENT'){
      if (user && (user.userRoleCode === data.role) && await passwordService.comparePassword(data.password, user.password)) {
        const { password, ...result } = user;
        return result as User;
      }
    }
    else {
      if (user && (user.userRoleCode !== 'PATIENT') && await passwordService.comparePassword(data.password, user.password)) {
        const { password, ...result } = user;
        return result as User;
      }
    }

    return null;
  }

}
