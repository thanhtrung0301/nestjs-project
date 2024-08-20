import * as bcrypt from "bcrypt";
import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  private SALT_ROUND = 10;
  private logger = new Logger("AuthService");
  constructor(
    @Inject("USER_SERVICE")
    private readonly users_service: ClientProxy,

    @Inject("GATEWAY_SERVICE") private readonly gateway_service: ClientProxy,
    private readonly jwt_service: JwtService
  ) {}

  async register(register_dto: RegisterDto) {
    try {
      const existed_user = await firstValueFrom(
        this.users_service.send(
          { cmd: "get_one" },
          {
            email: register_dto.email,
          }
        )
      );
      if (existed_user) {
        throw new RpcException(
          new ConflictException("Email already existed!!")
        );
      }

      const hashed_password = await bcrypt.hash(
        register_dto.password,
        this.SALT_ROUND
      );

      const user = await await firstValueFrom(
        this.users_service.send(
          { cmd: "create_one" },
          {
            ...register_dto,
            password: hashed_password,
          }
        )
      );

      this.gateway_service.emit(
        { cmd: "response" },
        { status: HttpStatus.CREATED, message: "Register successfully !" }
      );
    } catch (error) {
      throw error;
    }
  }

  async login(login_dto: LoginDto) {
    try {
      this.logger.verbose(login_dto);
      const { email, password } = login_dto;

      // Kiem tra tai khoan co ton tai khong
      const user = await firstValueFrom(
        this.users_service.send(
          { cmd: "get_one" },
          {
            conditions: { email },
            populateOptions: { path: "role", select: "name -_id" },
          }
        )
      );

      if (!user) {
        throw new RpcException(new UnauthorizedException("Wrong credential"));
      }

      // So sanh hash voi password duoc nhap
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new RpcException(new UnauthorizedException("Wrong credential"));
      }

      // Tao JWT
      const accessToken = this.jwt_service.sign(
        { _id: user._id, role: user.role.name },
        { expiresIn: "48h" }
      );
      console.log("🚀 ~ AuthService ~ login ~ accessToken:", accessToken)

      this.gateway_service.emit(
        { cmd: "response" },
        {
          status: HttpStatus.OK,
          token: accessToken,
          message: "Login successfully !",
        }
      );
    } catch (error) {
      throw error;
    }
  }
}
