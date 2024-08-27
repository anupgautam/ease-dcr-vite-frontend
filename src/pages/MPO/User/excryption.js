import CryptoJS from 'crypto-js';

const secretKey = 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef';


export const encryptData = (data) => {
    const dataString = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(dataString, secretKey).toString();
    // console.log("Encrypted Data:", encryptedData);
    return encryptedData
};


export const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
            throw new Error("Decryption failed, resulting in empty output.");
        }
        console.log(JSON.parse(decryptedText));
    } catch (error) {
        console.error("Decryption failed:", error.message);
        return null;
    }
};