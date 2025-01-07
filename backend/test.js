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

// useEffect(() => {
//     if (fileDetails) {
//         try {
//             const encryptedWordArray = CryptoJS.enc.Base64.parse(
//                 fileDetails.fileContent
//             );
//             const decodedSalt = CryptoJS.enc.Base64.parse(fileDetails.salt);
//             const decodedIV = CryptoJS.enc.Base64.parse(fileDetails.iv);

//             const derivedKey = CryptoJS.PBKDF2(
//                 fileDetails.key,
//                 decodedSalt,
//                 {
//                     keySize: 256 / 32,
//                     iterations: 1000,
//                 }
//             );

//             const decrypted = CryptoJS.AES.decrypt(
//                 { ciphertext: encryptedWordArray },
//                 derivedKey,
//                 { iv: decodedIV }
//             );

//             const decryptedBase64 = decrypted
//                 .toString(CryptoJS.enc.Base64)
//                 .trim();
//             if (decryptedBase64) {
//                 setEncryptedContent({
//                     fileContent: decryptedBase64,
//                     fileExtension: fileDetails.fileExtension,
//                 });
//             } else {
//                 console.error(
//                     'Decryption failed or returned empty content'
//                 );
//             }
//         } catch (error) {
//             console.error('Error during decryption:', error);
//         }
//     }
// }, [fileDetails]);
