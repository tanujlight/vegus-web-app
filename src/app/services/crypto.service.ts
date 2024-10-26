/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the project root for license information on type of purchased license.
 */

import {Injectable} from '@angular/core'
import {util, cipher} from 'node-forge'

@Injectable()
export class CryptoService {
  private readonly dataEncryptionSecretKey: string = 'n9YhjT63RTSKi%#5x2$qoCvgkNbpXyLz'

  public decryptData(encryptedData: string): object {
    const [ivHex, encryptedText] = encryptedData.split(':')
    const iv = util.hexToBytes(ivHex)

    const decipher = cipher.createDecipher('AES-CBC', this.dataEncryptionSecretKey)
    decipher.start({iv: iv})
    decipher.update(util.createBuffer(util.hexToBytes(encryptedText)))
    decipher.finish()

    const decryptedText = decipher.output.toString()

    return JSON.parse(decryptedText)
  }
}
