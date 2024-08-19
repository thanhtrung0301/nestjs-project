import { Body, Controller, Get, Header, Headers, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth/login')
  login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  @Post('auth/register')
  register(@Body() registerDto: RegisterDto) {
    return this.appService.register(registerDto);
  }

  @Get('user')
  getAll(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
   
    return this.appService.getAllUser(token);
  }

  // @UseGuards(AuthGuard)
  // @Get('user/profile')
  // async getProfile(@Request() req) {
  //   return this.users_service.getProfile(req.user);
  // }

  // @UseGuards(AuthGuard)
  // @Patch('profile')
  // async updateProfile(@Request() req, @Body() body) {
  //   return this.users_service.updateProfile(req?.user?._id, body);
  // }

  // @UseGuards(AuthGuard)
  // @Delete(':id')
  // @Roles(USER_ROLE.ADMIN)
  // @UseGuards(RolesGuard)
  // async deleteOne(@Param() params) {
  //   return this.users_service.deleteOne(params?.id);
  // }
}
