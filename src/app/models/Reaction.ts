import User from './User';

export default class Reaction {
  id?: number;
  type?: string;
  user?: User;


  constructor(type: string, user: User) {
    this.type = type;
    this.user = user;
  }
}
