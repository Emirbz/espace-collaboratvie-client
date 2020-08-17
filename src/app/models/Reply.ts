import User from './User';
import Topic from './Topic';


export default class Reply {
  id?: number;
  reply?: string;
  timestamp?: string;
  user?: User;
  users?: User[];
  topic?: Topic;
  useful?: boolean;


}
