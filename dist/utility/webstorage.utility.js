"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var CryptoJS = require("crypto-js");
var WebStorageUtility = (function () {
    function WebStorageUtility() {
    }
    WebStorageUtility.generateStorageKey = function (key) {
        if (index_1.WEBSTORAGE_CONFIG.secretKey) {
            return index_1.WEBSTORAGE_CONFIG.prefix + "enc_" + key;
        }
        return "" + index_1.WEBSTORAGE_CONFIG.prefix + key;
    };
    WebStorageUtility.get = function (storage, key) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        var value = storage.getItem(storageKey);
        if (index_1.WEBSTORAGE_CONFIG.secretKey && value !== null) {
            value = this.decrypt(value, index_1.WEBSTORAGE_CONFIG.secretKey) || '';
        }
        return WebStorageUtility.getGettable(value);
    };
    WebStorageUtility.set = function (storage, key, value) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        var strValue = WebStorageUtility.getSettable(value);
        if (index_1.WEBSTORAGE_CONFIG.secretKey) {
            strValue = this.encrypt(strValue, index_1.WEBSTORAGE_CONFIG.secretKey);
        }
        storage.setItem(storageKey, strValue);
    };
    WebStorageUtility.remove = function (storage, key) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        storage.removeItem(storageKey);
    };
    WebStorageUtility.getSettable = function (value) {
        return typeof value === "string" ? value : JSON.stringify(value);
    };
    WebStorageUtility.getGettable = function (value) {
        if (value === 'undefined')
            return undefined;
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    };
    WebStorageUtility.encrypt = function (value, password) {
        // Prepend sha256(value) to the value, we can use it to verify the decrypted result.
        var newValue = CryptoJS.SHA256(value).toString() + value;
        return CryptoJS.AES.encrypt(newValue, password).toString();
    };
    // Returns null if the password was incorrect.
    WebStorageUtility.decrypt = function (value, password) {
        var decrypted = CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
        if (decrypted.length < 64) {
            return null;
        }
        var sha256 = decrypted.substr(0, 64);
        var realValue = decrypted.substr(64);
        if (CryptoJS.SHA256(realValue).toString() !== sha256) {
            return null;
        }
        return realValue;
    };
    return WebStorageUtility;
}());
exports.WebStorageUtility = WebStorageUtility;
//# sourceMappingURL=webstorage.utility.js.map