import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/entities/role.entity';
import { RolesRepository } from 'src/repositories/roles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: 'RolesRepositoryInterface',
      useClass: RolesRepository,
    },
  ],
  exports: [RolesService],
})
export class RolesModule {}
