import User from './User';
import Reaction from './Reaction';
import Choix from './Choix';
import Room from './Room';
import LinkPreview from './LinkPreview';

export class MetaData {
  objectId: string;
  mimeType: string;
  presignedUrl: string;
  fileName: string;
}

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
  linkPreview?: LinkPreview;
  metaData?: MetaData;

  constructor(body: string, timestamp: string, type: string, room: Room, user: User) {
    this.body = body;
    this.timestamp = timestamp;
    this.type = type;
    this.room = room;
    this.user = user;
  }
}
