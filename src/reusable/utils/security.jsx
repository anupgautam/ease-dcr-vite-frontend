import CryptoJS from 'crypto-js';

export const encryptData = (data, key) => {
    
  const encrypted = CryptoJS.AES.encrypt(data, key);
  return encrypted.toString();
};

export const decryptData = (encryptedData, key) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};