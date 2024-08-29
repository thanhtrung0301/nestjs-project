import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class LoggerService {
  constructor(
    @Inject("TELEGRAM_SERVICE") private readonly queue: ClientProxy
  ) {}

  error(data: any) {
    this.queue.emit('telegram_queue', data)
  }
}

