const { v4: uuidv4 } = require('uuid');

export function generate8CharacterUUID() {
  const uuid = uuidv4().substr(0, 8);
  return uuid;
}