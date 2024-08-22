import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { Roles } from "src/decoratos/roles.decoratos";
import { USER_ROLE } from "src/entities/role.entity";
import { RolesGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { FilterQuery, PopulateOption, PopulateOptions } from "mongoose";
import { User } from "src/entities/user.entity";

@Controller("user")
export class UsersController {
  constructor(private readonly users_service: UsersService) {}

  @MessagePattern({ cmd: "get_all" })
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30) // override TTL to 30 seconds
  @Roles(USER_ROLE.ADMIN)
  async getAll(@Payload() data) {
    return this.users_service.getAll(data?.reqid, data?.client_id);
  }

  @MessagePattern({ cmd: "get_profile" })
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30) // override TTL to 30 seconds
  async getProfile(@Payload() data) {
    return this.users_service.getProfile(data);
  }

  @MessagePattern({ cmd: "update_profile" })
  @UseGuards(AuthGuard)
  @Patch("profile")
  async updateProfile(@Payload() data) {
    const { user, reqid, client_id, body } = data;
    return this.users_service.updateProfile(user?._id, reqid, client_id, body);
  }

  @MessagePattern({ cmd: "delete_user" })
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(":id")
  @Roles(USER_ROLE.ADMIN)
  async deleteOne(@Payload() data) {
    const { params, reqid, client_id } = data;
    return this.users_service.deleteOne(params, reqid, client_id);
  }

  @MessagePattern({ cmd: "get_one" })
  async getOne(data: {
    conditions: object;
    populateOptions?: PopulateOptions | PopulateOptions[];
  }) {
    const { conditions, populateOptions } = data;

    const condition: FilterQuery<User> = conditions;
    return this.users_service.findOneByCondition(condition, populateOptions);
  }

  @MessagePattern({ cmd: "create_one" })
  async createOne(create_dto: CreateUserDto) {
    return this.users_service.createUser(create_dto);
  }
}
