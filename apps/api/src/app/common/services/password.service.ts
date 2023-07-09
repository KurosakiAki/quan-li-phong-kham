import * as bcrypt from 'bcrypt';

class PasswordService {
  constructor() { }

  public async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  public async comparePassword(password: string, hashedPassword: string) {
    if (password == null || hashedPassword == null) {
      throw new Error('password and hash is required to compare');
    }

    return await bcrypt.compare(password, hashedPassword);
  }
}

const passwordService = new PasswordService();

export { passwordService }
