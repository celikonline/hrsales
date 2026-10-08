import { hashPassword } from '../server/security.js';
const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('En az 12 karakterli parola verin.');
  process.exit(1);
}
console.log(hashPassword(password));
