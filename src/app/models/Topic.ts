import User from './User';
import Tag from './Tag';


export default class Topic {
  id?: number;
  description?: string;
  title?: string;
  timestamp?: string;
  user?: User;
  status?: string;
  tags?: Tag[];
  countReplies?: number;
  seen?: number;


}
