import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from 'amqplib';


const TelegramBot = require("node-telegram-bot-api");

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly bot: any;
  private readonly errorChatId: string;
  private readonly rabbitmqUrl: string;
  
  constructor(private configService: ConfigService) {
    this.bot = new TelegramBot(
      this.configService.get("telegram.error_bot_token"),
      { polling: true }
    );
    this.errorChatId = this.configService.get("telegram.error_chat_id");
    this.rabbitmqUrl = 'amqp://localhost:5672';
  }

  async onModuleInit() {
    await this.listenToQueue();
  }

  private async listenToQueue() {
    try {
      const connection = await amqp.connect(this.rabbitmqUrl);
      const channel = await connection.createChannel();

      await channel.assertQueue('telegram_queue', { durable: false });
      console.log(`Waiting for messages in queue: telegram_queue`);

      channel.consume('telegram_queue', (msg) => {
        if (msg !== null) {
          const errorMessage = JSON.parse(msg.content.toString())?.data?.message;
          console.log(`Received error: ${errorMessage}`);
          this.sendErrorToChat(errorMessage);
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
    }
  }

  private async sendErrorToChat(error: string) {
    try {
      await this.bot.sendMessage(this.errorChatId, `Error: ${error}`);
    } catch (e) {
      console.error("Failed to send error message:", e);
    }
  }
}
