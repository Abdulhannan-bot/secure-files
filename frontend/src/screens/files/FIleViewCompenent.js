import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PDFViewer from './PDFViewer';
import { fetchFileDetails } from '../../redux/slices/filesSlice';
import { Button, Box, CircularProgress, Typography } from '@mui/material';

export default function FileViewComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    console.log(id);

    // Access file details and loading state from Redux
    const { fileDetails, loading } = useSelector((state) => state.files);

    useEffect(() => {
        // Dispatch Redux action to fetch file details
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

    // if (authorizationError) {
    //     return (
    //         <Box sx={{ padding: '20px' }}>
    //             <Typography color="error" variant="h6">
    //                 {authorizationError}
    //             </Typography>
    //         </Box>
    //     );
    // }

    if (!fileDetails) {
        return (
            <Box sx={{ padding: '20px' }}>
                <Typography color="textSecondary" variant="h6">
                    File not found.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/files')}>
                    Go Back
                </Button>
            </Box>
        );
    }

    // if (fileDetails) {
    //     console.log(fileDetails);
    // }

    const createURL = (fileContent, fileExtension) => {
        const blob = new Blob(
            [
                new Uint8Array(
                    atob(fileContent)
                        .split('')
                        .map((c) => c.charCodeAt(0))
                ),
            ],
            {
                type: `application/${fileExtension}`,
            }
        );
        const fileUrl = URL.createObjectURL(blob);
        return fileUrl;
    };

    const createBlob = (fileContent, fileExtension) => {
        const byteArray = new Uint8Array(
            atob(fileContent)
                .split('')
                .map((c) => c.charCodeAt(0))
        );

        // Determine MIME type based on file extension
        let mimeType;
        switch (fileExtension) {
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'jpg':
            case 'jpeg':
            case 'png':
                mimeType = 'image/' + fileExtension;
                break;
            case 'txt':
                mimeType = 'text/plain';
                break;
            case 'docx':
                mimeType =
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'xlsx':
                mimeType =
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            default:
                mimeType = 'application/octet-stream'; // Default binary stream
        }

        return new Blob([byteArray], { type: mimeType });
    };

    const displayFileInFrame = (fileContent, fileExtension) => {
        const blob = createBlob(fileContent, fileExtension);
        const fileUrl = URL.createObjectURL(blob);

        // Display in iframe for PDFs
        if (fileExtension === 'pdf') {
            return <PDFViewer base64Content={fileContent} />;
        }

        // Display in img tag for images
        if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
            return (
                <img
                    src={fileUrl}
                    alt="File Preview"
                    width="100%"
                    style={{ border: 'none' }}
                />
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
            <Typography variant="h4" gutterBottom>
                {fileDetails.name}
            </Typography>

            <>
                {displayFileInFrame(
                    fileDetails.fileContent,
                    fileDetails.fileExtension
                )}
            </>
        </Box>
    );
}
