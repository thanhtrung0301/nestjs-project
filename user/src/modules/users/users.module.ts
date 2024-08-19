import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../entities/user.entity";
import { UsersRepository } from "src/repositories/users.repository";
import { RolesService } from "@modules/roles/roles.service";
import { Role, RoleSchema } from "src/entities/role.entity";
import { RolesModule } from "@modules/roles/roles.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "GATEWAY_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "gateway_queue",
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: "UsersRepositoryInterface", useClass: UsersRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
