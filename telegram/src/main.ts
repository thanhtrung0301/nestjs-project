import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { TelegramModule } from "@modules/telegram/telegram.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TelegramModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"],
        queue: "error_queue",
        queueOptions: {
          durable: false,
        },
      },
    }
  );

  await app.listen();
}
bootstrap();
