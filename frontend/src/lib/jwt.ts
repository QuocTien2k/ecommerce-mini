import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

export function decodeToken(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token);
}
