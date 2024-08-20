import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { UsersRepositoryInterface } from "./interfaces/users.interface";
import { BaseServiceAbstract } from "@modules/services/base/base.abstract.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "@modules/roles/roles.service";
import { Role, USER_ROLE } from "src/entities/role.entity";
import { FindAllResponse } from "src/types/common.type";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject("UsersRepositoryInterface")
    private readonly users_repository: UsersRepositoryInterface,
    private readonly roles_service: RolesService,
    @Inject("GATEWAY_SERVICE") private readonly gateway_service: ClientProxy
  ) {
    super(users_repository);
  }

  async createUser(create_dto: CreateUserDto) {
    let user_role = await this.roles_service.findOneByCondition({
      name: create_dto.role,
    });
    if (!user_role) {
      user_role = await this.roles_service.create({
        name: create_dto.role,
      });
    }
    const user = await this.users_repository.create({
      ...create_dto,
      role: user_role._id,
    });

    this.gateway_service.emit({ cmd: "response" }, user);
  }

  async getProfile(user_id: string) {
    const user = await this.users_repository.findOneById(user_id, {
      path: "role",
      transform: (role: Role) => role?.name,
    });
    console.log("🚀 ~ UsersService ~ getProfile ~ user:", user)
    this.gateway_service.emit({ cmd: "response" }, user);
  }

  async updateProfile(user_id: string, update_dto: UpdateUserDto) {
    let toUpdate = await this.users_repository.findOneById(user_id);
    delete toUpdate.password;

    let updated = Object.assign(toUpdate, update_dto);
    updated = await this.users_repository.update(user_id, updated);

    this.gateway_service.emit({ cmd: "response" }, updated);
  }

  async deleteOne(user_id: string) {
    await this.users_repository.permanentlyDelete(user_id);
    this.gateway_service.emit(
      { cmd: "response" },
      {
        status: HttpStatus.OK,
        message: "Deleted successfully !",
      }
    );
  }

  async getAll() {
    const users = await this.users_repository.findAll(
      {},
      {},
      {
        path: "role",
        transform: (role: Role) => role?.name,
      }
    );
    this.gateway_service.emit({ cmd: "response" }, users);
  }
}
