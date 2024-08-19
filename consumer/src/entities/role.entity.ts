import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

export enum USER_ROLE {
	ADMIN = 'Admin',
	USER = 'User',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Role extends BaseEntity {
  @Prop({ required: true, default: USER_ROLE.USER, enum: USER_ROLE, })
  name: string;

  @Prop({})
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
