import {WEBSTORAGE_CONFIG} from '../index';
import * as CryptoJS from 'crypto-js';

export class WebStorageUtility {
    static generateStorageKey(key: string): string {
        if (WEBSTORAGE_CONFIG.secretKey) {
            return `${WEBSTORAGE_CONFIG.prefix}enc_${key}`;
        }
        return `${WEBSTORAGE_CONFIG.prefix}${key}`;
    }

    static get(storage: Storage, key: string): any {
        const storageKey = WebStorageUtility.generateStorageKey(key);
        let value = storage.getItem(storageKey);
        if (WEBSTORAGE_CONFIG.secretKey && value !== null) {
            value = this.decrypt(value, WEBSTORAGE_CONFIG.secretKey) || '';
        }
        return WebStorageUtility.getGettable(value);
    }

    static set(storage: Storage, key: string, value: any): void {
        const storageKey = WebStorageUtility.generateStorageKey(key);
        let strValue = WebStorageUtility.getSettable(value);
        if (WEBSTORAGE_CONFIG.secretKey) {
            strValue = this.encrypt(strValue, WEBSTORAGE_CONFIG.secretKey);
        }
        storage.setItem(storageKey, strValue);
    }

    static remove(storage: Storage, key: string): void {
        let storageKey = WebStorageUtility.generateStorageKey(key);

        storage.removeItem(storageKey);
    }

    private static getSettable(value: any): string {
        return typeof value === "string" ? value : JSON.stringify(value);
    }

    private static getGettable(value: string): any {
        if (value === 'undefined') return undefined;
        try {
            return JSON.parse(value);
        } catch(e) {
            return value;
        }
    }

    private static encrypt(value: string, password: string): string {
        // Prepend sha256(value) to the value, we can use it to verify the decrypted result.
        const newValue = CryptoJS.SHA256(value).toString() + value;
        return CryptoJS.AES.encrypt(newValue, password).toString();
    }

    // Returns null if the password was incorrect.
    private static decrypt(value: string, password: string): string {
        const decrypted = CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
        if (decrypted.length < 64) {
            return null;
        }
        const sha256 = decrypted.substr(0, 64);
        const realValue = decrypted.substr(64);
        if (CryptoJS.SHA256(realValue).toString() !== sha256) {
            return null;
        }
        return realValue;
    }
}
