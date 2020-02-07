import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader) {
    return res.status(400).json({
      error: 'Jwt was not provided',
    });
  }

  const [, token] = authHeader.split(' ');

  try {

    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    next();

  }catch(e) {
    return res.status(400).json({
      error: 'Invalid token.'
    });
  }
}