import { Body, Controller, Delete, Get, Param, Patch, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseGuards(AuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly users_service: UsersService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('')
  async getAll() {
    return this.users_service.getAll()
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('profile')
  async getProfile(@Request() req) {
    return this.users_service.getProfile(req.user)
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() body, ) {
    return this.users_service.updateProfile(req?.user?._id, body);
  }

  @Delete(':id')
  async deleteOne(@Param() params) {
    return this.users_service.deleteOne(params?.id)
  }
}
