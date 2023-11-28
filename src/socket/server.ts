import { Server } from "socket.io";
import * as http from "http";
import { UsersState } from "./UsersState";
import buildMessage from "./message-builder";
import { RoomJoinMessage, User } from "./types";
import { EventsEnum } from "./events.enum";

const socketOptions = { cors: { origin: "*" } };

export const bootstrapWsServer = (httpServerApp: http.Server): void => {
  const io = new Server(httpServerApp, socketOptions);

  const usersState = new UsersState();
  const chatAppName = "Chat App";

  io.on(EventsEnum.Connection, socket => {
    console.log(`User ${socket.id} connected`);
    socket.emit(EventsEnum.Message, buildMessage(chatAppName, "Welcome to chat!"));

    socket.on(EventsEnum.RoomEnter, ({ name, room }: RoomJoinMessage) => {
      const previousRoom = usersState.getUserById(socket.id)?.room;

      if (previousRoom) {
        socket.leave(previousRoom);
        io.to(previousRoom).emit(EventsEnum.Message, buildMessage(chatAppName, `${name} has left the room`));
      }

      const user: User = usersState.activateUser({ id: socket.id, name, room });

      if (previousRoom) {
        io.to(previousRoom).emit(EventsEnum.UserList, {
          users: usersState.getUsersInRoom(previousRoom)
        });
      }

      socket.join(user.room);

      socket.emit(EventsEnum.Message, buildMessage(chatAppName, `What's up ${name}? You're in room ${room}`));

      socket.broadcast.to(user.room).emit(EventsEnum.Message, buildMessage(chatAppName, `${user.name} has joined to ${room}`));

      io.to(user.room).emit(EventsEnum.UserList, {
        users: usersState.getUsersInRoom(user.room)
      });

      io.emit(EventsEnum.RoomList, {
        rooms: usersState.getAllActiveRooms()
      });
    });

    socket.on(EventsEnum.Message, ({ name, text }) => {
      const room = usersState.getUserById(socket.id)?.room;
      if (room) {
        io.to(room).emit(EventsEnum.Message, buildMessage(name, text));
      }
    });

    // Listen for activity
    socket.on(EventsEnum.Activity, (name) => {
      const room = usersState.getUserById(socket.id)?.room;
      if (room) {
        socket.broadcast.to(room).emit(EventsEnum.Activity, name);
      }
    });

    socket.on(EventsEnum.Disconnect, () => {
      const user = usersState.getUserById(socket.id);
      usersState.removeUserById(user?.id as string);

      if (user) {
        io.to(user.room).emit(EventsEnum.Message, buildMessage(chatAppName, `${user.name} has left the room`));

        io.to(user.room).emit(EventsEnum.UserList, {
          users: usersState.getUsersInRoom(user.room)
        });

        io.emit(EventsEnum.RoomList, { rooms: usersState.getAllActiveRooms() });
      }

      console.log(`User ${socket.id} has left`);
    });

  });

};
