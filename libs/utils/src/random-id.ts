import { v4 as uuidv4 } from 'uuid';

export class RandomId {
  static generateId() {
    return uuidv4();
  }
}
