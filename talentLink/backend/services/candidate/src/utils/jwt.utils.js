import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../../../../key/key_new.pub'), 'utf8');

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
  } catch (error) {
    return null;
  }
};
