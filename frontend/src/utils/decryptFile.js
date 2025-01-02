const decryptFile = async (encryptedContent, iv, key) => {
    try {
        // Convert base64 key back to CryptoKey
        const rawKey = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));
        const cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            rawKey,
            'AES-GCM',
            true,
            ['decrypt']
        );

        // Decode base64 content and IV
        const encryptedData = Uint8Array.from(atob(encryptedContent), (c) =>
            c.charCodeAt(0)
        );
        const ivArray = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

        // Decrypt the content
        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: ivArray,
            },
            cryptoKey,
            encryptedData
        );

        return new Uint8Array(decryptedContent);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt file');
    }
};

export default decryptFile;
