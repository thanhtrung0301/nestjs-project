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
    console.log("🚀 ~ AuthService ~ register ~ register_dto:", register_dto);
    try {
      const existed_user = await firstValueFrom(
        this.users_service.send(
          { cmd: "get_one" },
          {
            conditions: { email: register_dto.email },
            populateOptions: { path: "role", select: "name -_id" },
          }
        )
      );
      console.log("🚀 ~ AuthService ~ register ~ existed_user:", existed_user);
      if (existed_user) {
        return this.gateway_service.emit(
          { cmd: "response" },
          {
            status: HttpStatus.CONFLICT,
            message: "Email already existed!!",
            reqid: register_dto.reqid,
            client_id: register_dto.client_id,
          }
        );
      }

      const hashed_password = await bcrypt.hash(
        register_dto.password,
        this.SALT_ROUND
      );

      this.users_service.emit(
        { cmd: "create_one" },
        {
          ...register_dto,
          password: hashed_password,
        }
      );

      this.gateway_service.emit(
        { cmd: "response" },
        {
          status: HttpStatus.CREATED,
          message: "Register successfully !",
          reqid: register_dto.reqid,
          client_id: register_dto.client_id,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async login(login_dto: LoginDto) {
    try {
      this.logger.verbose(login_dto);
      const { email, password, reqid, client_id } = login_dto;

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
        return this.gateway_service.emit(
          { cmd: "response" },
          {
            status: HttpStatus.UNAUTHORIZED,
            message: "Wrong credential",
            reqid,
            client_id,
          }
        );
      }

      // So sanh hash voi password duoc nhap
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return this.gateway_service.emit(
          { cmd: "response" },
          {
            status: HttpStatus.UNAUTHORIZED,
            message: "Wrong credential",
            reqid,
            client_id,
          }
        );
      }

      // Tao JWT
      const accessToken = this.jwt_service.sign(
        { _id: user._id, role: user.role.name },
        { expiresIn: "48h" }
      );

      this.gateway_service.emit(
        { cmd: "response" },
        {
          reqid,
          client_id,
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
