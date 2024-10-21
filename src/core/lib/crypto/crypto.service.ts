import * as crypto from 'crypto-js'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CryptoService {

  public encrypt(value): any {
    const result = crypto.AES.encrypt(value, 'Key')
    return result.toString()
  }

  public decrypt(value): any {
    const result = crypto.AES.decrypt(value, 'Key')
    return result.toString(crypto.enc.Utf8)
  }
}
