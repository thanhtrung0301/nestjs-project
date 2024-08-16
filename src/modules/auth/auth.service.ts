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

@Injectable()
export class AuthService {
  private SALT_ROUND = 10;
  private logger = new Logger('AuthService');
  constructor(private readonly users_service: UsersService) {}

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
      const { email, password } = login_dto;

      const user = await this.users_service.findOneByCondition({ email });
      if (!user) {
        throw new UnauthorizedException('Wrong credential');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Wrong credential');
      }

      return { status: HttpStatus.CREATED, message: 'Login successfully !' };
    } catch (error) {
      throw error;
    }
  }
}
