import { User } from "./types";

export class UsersState {
  public users: Array<User> = [];

  private setUsers(usersArray: Array<User>) {
    this.users = usersArray;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  public removeUserById(id: string): void {
    this.setUsers(this.users.filter(user => user.id !== id));
  }

  public activateUser(newUser: User): User {

    const newArr = this.users.filter(user => newUser.id !== user.id);

    this.setUsers([newUser, ...newArr]);
    return newUser;
  }

  public getUsersInRoom(room: string): Array<User> {
    return this.users.filter(user => user.room === room);
  }

  public getAllActiveRooms(): Array<string> {
    return Array.from(new Set(this.users.map(user => user.room)));
  }
}
