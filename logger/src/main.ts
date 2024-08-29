import { LoggerModule } from "@modules/logger/logger.module";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LoggerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"],
        queue: "logger_queue",
        queueOptions: {
          durable: false,
        },
      },
    }
  );

  await app.listen();
}
bootstrap();
