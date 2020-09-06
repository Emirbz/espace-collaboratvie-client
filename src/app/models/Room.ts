import User from './User';

export enum Status {
  PENDING = 'ACCEPTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export default class Room {
  id?: number;
  name?: string;
  subject?: string;
  image?: string;
  users?: User[];
  user?: User;
  isPrivate: boolean;
  requestStatus: Status;

  constructor(id: number) {
    this.id = id;
  }
}

