import * as bcrypt from "bcryptjs";

export function hashValue(value: string) {
  return bcrypt.hash(value, 10);
}

export function verifyHash(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}
