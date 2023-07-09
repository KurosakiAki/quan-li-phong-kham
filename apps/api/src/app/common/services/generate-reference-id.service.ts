import * as crypto from 'crypto';

class GenerateReferenceIdService {
  constructor() { }

  public async generateCode() {
    const randomInt = crypto.randomInt(0, 999999999);
    return randomInt.toString().padStart(9, '0');
  }
}

const generateReferenceIdService = new GenerateReferenceIdService();

export { generateReferenceIdService }
