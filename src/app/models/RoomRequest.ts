import User from './User';
import Room from './Room';

export enum Status {
  PENDING = 'ACCEPTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export default class RoomRequest {
  id?: number;
  user?: User;
  status?: Status;
  room?: Room;

}
