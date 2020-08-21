import User from './User';

export default class Room {
  id?: number;
  name?: string;
  subject?: string;
  image?: string;
  users?: User[];
  user?: User;
  isPrivate: boolean;

  constructor(id: number) {
    this.id = id;
  }
}

