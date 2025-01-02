import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import {
    fetchAdminFiles,
    uploadFile,
    generateLink,
} from '../../../redux/slices/filesSlice';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Modal,
    Box,
    TextField,
    Select,
    MenuItem,
    CircularProgress,
    IconButton,
} from '@mui/material';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
// import HeaderComponent from '../../components/header/HeaderComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import { Download, Share } from '@mui/icons-material'; // Add necessary icons

export default function AdminFilesComponent() {
    const dispatch = useDispatch();
    const { adminFiles, loading } = useSelector((state) => state.files);

    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileData, setFileData] = useState({ name: '', file: null });
    const [shareData, setShareData] = useState({
        email: '',
        permission: 'view',
        fileId: null,
    });

    useEffect(() => {
        dispatch(fetchAdminFiles());
    }, [dispatch]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileData((prev) => ({ ...prev, file }));
        }
    };

    const handleAddFile = async () => {
        if (!fileData.file || !fileData.name) {
            toast.error('All fields are required');
            return;
        }

        const fileExtension = fileData.file.name.split('.').pop();

        // Generate salt and IV
        const salt = CryptoJS.lib.WordArray.random(16);
        const iv = CryptoJS.lib.WordArray.random(16);

        // Derive the key using a password and salt
        const password = 'W8!tHz#5k2@3BxYq^1Fg%Lr&9Mn@ZkJ';
        const key = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 1000,
        });

        // Helper function to read file content as ArrayBuffer
        const readFile = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });

        try {
            // Read the file content
            const fileBuffer = await readFile(fileData.file);

            // Convert the fileBuffer (ArrayBuffer) to a CryptoJS WordArray
            const wordArray = CryptoJS.lib.WordArray.create(
                new Uint8Array(fileBuffer)
            );

            // Encrypt the file content
            const encrypted = CryptoJS.AES.encrypt(wordArray, key, { iv });

            // Prepare the encrypted file as a Blob
            const encryptedBlob = new Blob(
                [encrypted.ciphertext.toString(CryptoJS.enc.Base64)],
                { type: 'application/octet-stream' }
            );

            // Create FormData to send to the backend
            const formData = new FormData();
            formData.append(
                'file',
                encryptedBlob,
                `encrypted_${fileData.name}`
            );
            formData.append('extension', fileExtension);
            formData.append('salt', salt.toString(CryptoJS.enc.Base64));
            formData.append('iv', iv.toString(CryptoJS.enc.Base64));
            formData.append('name', fileData.name);

            console.log('Sending encrypted file to backend...');
            try {
                await dispatch(uploadFile(formData)).unwrap();
                setFileData({ name: '', file: null });
                setIsAddFileModalOpen(false);
                dispatch(fetchAdminFiles());
            } catch (error) {
                console.error('File upload failed:', error);
            }
        } catch (error) {
            console.error('Error during encryption/decryption:', error);
            toast.error('An error occurred during the process');
        }
    };

    const handleShare = () => {
        if (shareData.email && shareData.fileId) {
            dispatch(generateLink(shareData));
            setIsModalOpen(false);
        } else {
            alert('Please provide all required details.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f4f6f8',
            }}>
            {/* Header */}
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <CircularProgress size={80} color="inherit" />
                </Box>
            )}
            <HeaderComponent />

            <Box sx={{ padding: '20px' }}>
                <Button
                    variant="contained"
                    sx={{
                        mb: 2,
                        float: 'right',
                        fontSize: '0.9rem',
                    }}
                    onClick={() => setIsAddFileModalOpen(true)}>
                    Add File
                </Button>

                <TableContainer
                    sx={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Table sx={{ maxWidth: '600px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>File Name</TableCell>
                                <TableCell>Added By</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminFiles.map((file) => {
                                return (
                                    <TableRow key={file.id}>
                                        <TableCell>
                                            <Link
                                                to={`/files/view/${file.id}`}
                                                target="_blank">
                                                {file.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {`${file.user.first_name} ${file.user.last_name}`}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                variant="outlined"
                                                href={file.download_url}>
                                                <Download />
                                            </IconButton>
                                            <IconButton
                                                variant="outlined"
                                                onClick={() => {
                                                    setShareData((prev) => ({
                                                        ...prev,
                                                        fileId: file.id,
                                                    }));
                                                    setIsModalOpen(true);
                                                }}>
                                                <Share />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal
                    open={isAddFileModalOpen}
                    onClose={() => setIsAddFileModalOpen(false)}>
                    <Box sx={{ ...modalStyle }}>
                        <h2>Add File</h2>
                        <TextField
                            label="File Name"
                            value={fileData.name}
                            onChange={(e) =>
                                setFileData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="outlined" component="label" fullWidth>
                            Select File
                            <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        {fileData.file && (
                            <p style={{ marginTop: '10px' }}>
                                Selected: {fileData.file.name}
                            </p>
                        )}
                        <Button
                            variant="contained"
                            onClick={handleAddFile}
                            sx={{ mt: 2 }}>
                            Add File
                        </Button>
                    </Box>
                </Modal>

                {/* Share File Modal */}
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Box sx={{ ...modalStyle }}>
                        <h2>Share File</h2>
                        <TextField
                            label="Email"
                            value={shareData.email}
                            onChange={(e) =>
                                setShareData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            fullWidth
                            margin="normal"
                        />
                        <Select
                            value={shareData.permission}
                            onChange={(e) =>
                                setShareData((prev) => ({
                                    ...prev,
                                    permission: e.target.value,
                                }))
                            }
                            fullWidth>
                            <MenuItem value="view">View</MenuItem>
                            <MenuItem value="download">Download</MenuItem>
                        </Select>
                        <Button
                            variant="contained"
                            onClick={handleShare}
                            sx={{ mt: 2 }}>
                            Generate Link
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
