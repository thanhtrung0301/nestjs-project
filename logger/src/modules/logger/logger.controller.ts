import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { LoggerService } from "./logger.service";

@Controller("logger")
export class LoggerController {
  constructor(private logger_service: LoggerService) {}
  @MessagePattern({ cmd: "telegram" })
  async logError(@Payload() data) {
    return this.logger_service.error(data);
  }
}
