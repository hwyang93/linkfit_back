import { Injectable, NestMiddleware } from '@nestjs/common';
import { pick } from 'lodash';

const jwt = require('jsonwebtoken');
@Injectable()
export class JwtAuthenticationMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const token = this.getToken(req);
    if (token) {
      const verifyInfo = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      req.member = pick(verifyInfo, ['seq', 'email']);
    }

    next();
  }

  getToken(req: any) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
  }
}
