// Decrypt the file for testing
const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(
        encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    ),
});
const decryptedBytes = CryptoJS.AES.decrypt(cipherParams, key, {
    iv,
});

// Convert decrypted WordArray back to Uint8Array
const decryptedArray = new Uint8Array(decryptedBytes.words.length * 4);
decryptedBytes.words.forEach((word, i) => {
    decryptedArray.set(
        [
            (word >> 24) & 0xff,
            (word >> 16) & 0xff,
            (word >> 8) & 0xff,
            word & 0xff,
        ],
        i * 4
    );
});

// Prepare the decrypted file as a Blob
const decryptedBlob = new Blob([decryptedArray], {
    type: fileData.file.type,
});
