import User from './User';
import Room from './Room';

export default class RoomRequest {
  id?: number;
  user?: User;
  status?: string;
  room?: Room;

}
