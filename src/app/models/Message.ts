import User from './User';
import Reaction from './Reaction';
import Choix from './Choix';
import Room from './Room';

export default class Message {
  id?: number;
  body?: string;
  file?: string;
  timestamp?: string;
  type?: string;
  room?: Room;
  user?: User;
  reactions?: Reaction[];
  choix: Choix[];

  constructor(body: string, timestamp: string, type: string, room: Room, user: User) {
    this.body = body;
    this.timestamp = timestamp;
    this.type = type;
    this.room = room;
    this.user = user;
  }
}
