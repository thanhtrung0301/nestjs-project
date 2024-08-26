import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private readonly bot: any;
  constructor(private configService: ConfigService) {
    this.bot = new TelegramBot(
      this.configService.get("telegram.error_bot_token"),
      { polling: true }
    );
    this.bot.on("message", this.onReceivedMessage);
  }

  onReceivedMessage(msg: any) {
    console.log("🚀 ~ TelegramService ~ onReceivedMessage ~ msg:", msg);
  }
}
