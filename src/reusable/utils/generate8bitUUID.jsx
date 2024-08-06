// const { v4: uuidv4 } = require('uuid');
import { v4 as uuidv4 } from "uuid";

export function generate8CharacterUUID() {
  const uuid = uuidv4().substr(0, 8);
  return uuid;
}