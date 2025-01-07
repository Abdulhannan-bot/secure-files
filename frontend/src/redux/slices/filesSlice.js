// /redux/filesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import decryptFile from '../../utils/decryptFile';
import api from '../../api/apiService';
import CryptoJS from 'crypto-js';

// Async thunks

const filesHelper = (fileDetails) => {
    try {
        const encryptedWordArray = CryptoJS.enc.Base64.parse(
            fileDetails.file_content
        );
        const decodedSalt = CryptoJS.enc.Base64.parse(fileDetails.salt);
        const decodedIV = CryptoJS.enc.Base64.parse(fileDetails.iv);

        const derivedKey = CryptoJS.PBKDF2(fileDetails.key, decodedSalt, {
            keySize: 256 / 32,
            iterations: 1000,
        });

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encryptedWordArray },
            derivedKey,
            { iv: decodedIV }
        );

        const decryptedBase64 = decrypted.toString(CryptoJS.enc.Base64).trim();
        if (decryptedBase64) {
            return {
                fileContent: decryptedBase64,
                fileExtension: fileDetails.file_extension,
                name: fileDetails.name,
                extenstion: fileDetails.extenstion,
            };
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export const fetchFiles = createAsyncThunk('filesList', async () => {
    try {
        const response = await api.get('files/list/');
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to fetch files';
        throw new Error(errorMsg);
    }
});

export const fetchAdminFiles = createAsyncThunk('filesAdminList', async () => {
    try {
        const response = await api.get('files/list/all/');
        // toast.success('Files fetched successfully');
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to fetch files';

        throw new Error(errorMsg);
    }
});

export const fetchFileDetails = createAsyncThunk(
    'files/fetchFileDetails',
    async (fileId) => {
        try {
            const response = await api.get(`files/details/${fileId}/`);
            // const { file_content, file_extension } = response.data.data;
            const { file_content, salt, iv, key, name, file_extension } =
                response.data.data;

            return filesHelper(response.data.data);
            // return {
            //     fileContent: file_content,
            //     salt,
            //     iv,
            //     key,
            //     fileExtension: file_extension,
            //     name,
            // };
        } catch (error) {
            // Handle authorization error here
            console.log(error);

            let errorMsg =
                error.response?.data?.error || 'Failed to fetch file details';
            if (error.response?.status === 403) {
                errorMsg = 'You are not authorized to view this file';
            }
            // toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);

export const uploadFile = createAsyncThunk(
    'files/uploadFile',
    async (fileData) => {
        try {
            const response = await api.post('files/upload/', fileData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('File uploaded successfully');
            return response.data;
        } catch (error) {
            const errorMsg =
                error.response?.data?.error || 'Failed to upload file';
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);

export const downloadFile = createAsyncThunk(
    'files/downloadFile',
    async (fileId) => {
        try {
            const response = await api.get(`files/download/${fileId}/`, {
                responseType: 'blob',
            });
            console.log(response.data);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            console.log(url);

            const link = document.createElement('a');
            link.href = url;
            // Extract the filename from the response headers
            const contentDisposition = response.headers['content-disposition'];
            console.log(contentDisposition);

            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
                : 'downloaded-file';

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('File downloaded successfully');
            return { fileId };
        } catch (error) {
            const errorMsg =
                error.response?.data?.error || 'Failed to download file';
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);

export const generateLink = createAsyncThunk(
    'files/generateLink',
    async (fileId) => {
        try {
            const response = await api.get(`files/generate-link/${fileId}/`);
            toast.success('Shareable link generated successfully');
            return response.data;
        } catch (error) {
            const errorMsg =
                error.response?.data?.error || 'Failed to generate link';
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);

export const validateLink = createAsyncThunk(
    'files/validateLink',
    async ({ fileId, token }) => {
        try {
            const response = await api.get(
                `files/validate-link/${fileId}/${token}/`
            );
            toast.success('Link validated successfully');
            return response.data;
        } catch (error) {
            const errorMsg =
                error.response?.data?.error || 'Failed to validate link';
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);

// Initial state
const initialState = {
    files: [],
    adminFiles: [],
    fileDetails: null,
    loading: false,
    error: null,
};

// Slice
const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.loading = false;
                state.files = action.payload;
            })
            .addCase(fetchFiles.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchAdminFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminFiles.fulfilled, (state, action) => {
                state.loading = false;
                state.adminFiles = action.payload;
            })
            .addCase(fetchAdminFiles.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchFileDetails.pending, (state) => {
                state.loading = true;
                state.authorizationError = null;
                state.error = null;
            })
            .addCase(fetchFileDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.fileDetails = action.payload;
            })
            .addCase(fetchFileDetails.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(uploadFile.pending, (state) => {
                state.loading = true;
                state.erro = null;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.loading = false;
                // state.files.push(action.payload);
            })
            .addCase(uploadFile.rejected, (state) => {
                state.loading = false;
            })
            .addCase(downloadFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(downloadFile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(downloadFile.rejected, (state) => {
                state.loading = false;
            })
            .addCase(generateLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateLink.fulfilled, (state, action) => {
                state.loading = false;
                state.shareableLink = action.payload.link;
            })
            .addCase(generateLink.rejected, (state) => {
                state.loading = false;
            })
            .addCase(validateLink.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateLink.fulfilled, (state, action) => {
                state.loading = false;
                state.validationData = action.payload;
            })
            .addCase(validateLink.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default filesSlice.reducer;
