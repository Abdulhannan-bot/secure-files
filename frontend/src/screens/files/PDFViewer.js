import React, { useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ base64Content = '' }) => {
    useEffect(() => {
        const preventCopy = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                return false;
            }
        };

        const preventRightClick = (e) => {
            e.preventDefault();
        };

        document.addEventListener('keydown', preventCopy, true);
        document.addEventListener('contextmenu', preventRightClick, true);

        return () => {
            document.removeEventListener('keydown', preventCopy, true);
            document.removeEventListener(
                'contextmenu',
                preventRightClick,
                true
            );
        };
    }, []);

    const pdfContentUrl = `data:application/pdf;base64,${base64Content}`;

    const base64ToBlob = (base64, contentType) => {
        const base64WithoutPrefix = base64.includes(',')
            ? base64.split(',')[1]
            : base64;
        // console.log(base64WithoutPrefix);

        const byteCharacters = atob(base64WithoutPrefix.trim());
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    };

    const pdfBlob = base64ToBlob(base64Content, 'application/pdf');
    const pdfBlobUrl = pdfBlob ? URL.createObjectURL(pdfBlob) : null;

    return (
        <div width="100%" height="750px" style={{ border: 'none' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={pdfBlobUrl}
                    theme={{
                        theme: {
                            toolbar: {
                                display: 'none',
                            },
                        },
                    }}
                    defaultScale={1}
                    onCopySuccess={() => false}
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
