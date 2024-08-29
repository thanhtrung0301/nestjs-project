import { Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerController } from "./logger.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "TELEGRAM_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "telegram_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [LoggerService],
  controllers: [LoggerController],
})
export class LoggerModule {}
