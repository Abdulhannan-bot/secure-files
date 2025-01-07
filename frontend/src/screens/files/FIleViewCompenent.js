import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PDFViewer from './PDFViewer';
import { fetchFileDetails } from '../../redux/slices/filesSlice';
import { Button, Box, CircularProgress, Typography } from '@mui/material';

export default function FileViewComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [encryptedContent, setEncryptedContent] = useState(null);

    console.log(id);

    const { fileDetails, loading } = useSelector((state) => state.files);

    useEffect(() => {
        if (id) {
            dispatch(fetchFileDetails(id));
        }
    }, [id, dispatch]);

    if (loading) {
        return (
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
        );
    }

    if (!fileDetails) {
        return (
            <Box
                sx={{
                    padding: '20px',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Typography color="textSecondary" variant="h6">
                    File not found.
                </Typography>
            </Box>
        );
    }

    const displayFileInFrame = (fileContent, fileExtension) => {
        let fileUrl = '';
        // Display in iframe for PDFs
        if (fileExtension === 'pdf') {
            return (
                <PDFViewer
                    base64Content={`data:application/pdf;base64,${fileContent}`}
                />
            );
        }
        // Display in img tag for images

        if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
            return (
                <div width="100%" height="750px" style={{ border: 'none' }}>
                    <img
                        src={`data:image/png;base64,${fileContent}`}
                        alt="File Preview"
                        width="100%"
                        style={{ border: 'none' }}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </div>
            );
        }

        // Display in object tag for other files (e.g., Word, Excel, Text)
        return (
            <object
                data={fileUrl}
                type={`application/${fileExtension}`}
                width="100%"
                height="750px">
                <p>
                    Your browser does not support this file format. Please
                    download it to view.
                </p>
            </object>
        );
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                {fileDetails.name}
            </Typography>
            {fileDetails && (
                <>
                    {displayFileInFrame(
                        fileDetails.fileContent,
                        fileDetails.fileExtension
                    )}
                </>
            )}
        </Box>
    );
}
