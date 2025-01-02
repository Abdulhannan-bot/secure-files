import React, { useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
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

    return (
        <div width="100%" height="750px" style={{ border: 'none' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={pdfContentUrl}
                    // plugins={[defaultLayoutPluginInstance]}
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
