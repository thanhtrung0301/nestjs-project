import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe())

  const port = 3000;
  await app.startAllMicroservices();
  await app.listen(port);
  
  logger.log(`Application running on port ${port}`);
}
bootstrap();
