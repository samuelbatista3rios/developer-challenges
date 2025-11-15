import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly user = { email: 'user@dynamox.com', password: '123456' };

  constructor(private readonly jwtService: JwtService) {}

  login(dto: LoginDto): { access_token: string } {
    if (dto.email !== this.user.email || dto.password !== this.user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: dto.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
