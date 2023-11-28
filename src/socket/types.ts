export interface UserMessage {
  name: string;
  text: string;
}

export interface RoomJoinMessage {
  name: string;
  room: string;
}

export interface User {
  name: string;
  room: string;
  id: string;
}

export interface BuiltMessage extends UserMessage{
  time: string;
}
