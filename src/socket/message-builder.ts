import { BuiltMessage } from "./types";

export default function buildMessage(name: string, text: string): BuiltMessage {
  return {
    name, text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    }).format(new Date())
  };
}
