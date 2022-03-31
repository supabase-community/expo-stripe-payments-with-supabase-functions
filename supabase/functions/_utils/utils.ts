import { JwtUser } from "./types.ts";

export const jwtDecoder = (jwt: string): JwtUser =>
  JSON.parse(atob(jwt.split(".")[1]));
