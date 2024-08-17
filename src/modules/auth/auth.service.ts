import * as bcrypt from 'bcrypt';
import { UsersService } from '@modules/users/users.service';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private SALT_ROUND = 10;
  private logger = new Logger('AuthService');
  constructor(
    private readonly users_service: UsersService,
    private readonly jwt_service: JwtService,
  ) {}

  async register(register_dto: RegisterDto) {
    try {
      const existed_user = await this.users_service.findOneByCondition({
        email: register_dto.email,
      });
      if (existed_user) {
        throw new ConflictException('Email already existed!!');
      }

      const hashed_password = await bcrypt.hash(
        register_dto.password,
        this.SALT_ROUND,
      );

      const user = await this.users_service.create({
        ...register_dto,
        password: hashed_password,
      });

      return { status: HttpStatus.CREATED, message: 'Register successfully !' };
    } catch (error) {
      throw error;
    }
  }

  async login(login_dto: LoginDto) {
    try {
      this.logger.verbose(login_dto);
      const { email, password } = login_dto;

      // Kiem tra tai khoan co ton tai khong
      const user = await this.users_service.findOneByCondition(
        { email },
        { path: 'role', select: 'name -_id' },
      );
      this.logger.verbose(user);

      if (!user) {
        throw new UnauthorizedException('Wrong credential');
      }

      // So sanh hash voi password duoc nhap
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Wrong credential');
      }

      // Tao JWT
      const accessToken = this.jwt_service.sign(
        { _id: user._id, role: user.role.name },
        { expiresIn: '48h' },
      );

      return {
        status: HttpStatus.OK,
        token: accessToken,
        message: 'Login successfully !',
      };
    } catch (error) {
      throw error;
    }
  }
}
