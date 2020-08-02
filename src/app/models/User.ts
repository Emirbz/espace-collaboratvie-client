export default class User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: string;

  constructor(id: string, firstName: string, lastName: string, image: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.image = image;
  }
}
