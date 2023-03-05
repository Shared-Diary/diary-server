export abstract class SmsService {
  abstract sendMessage(to: string, message: string): Promise<void>;
}
