export class JwtPayload {
  email: string;
  id: string;
  role: string;
  tokenType: string;
  iat: number;
  exp: number;
}
