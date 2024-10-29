import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoJSService {
  private secretKey = 'mySecretKey';

  public encryptAndSaveToLocalStorage(key: string, data: any): void {
    const jsonData = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(
      jsonData,
      this.secretKey
    ).toString();
    localStorage.setItem(key, encryptedData);
  }

  public getFromLocalStorageAndDecrypt(key: string): any {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedData) {
          return JSON.parse(decryptedData);
        } else {
          localStorage.removeItem(key);
          return null;
        }
      } catch (error) {
        localStorage.removeItem(key);
        return null;
      }
    }
    return null;
  }
}
