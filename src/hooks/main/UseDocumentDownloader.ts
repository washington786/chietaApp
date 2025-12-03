import { useState } from 'react';
import { File, Directory, Paths } from 'expo-file-system';

interface UseDocumentDownloaderResult {
    downloadDocument: (url: string, filename: string) => Promise<string | null>;
    isLoading: boolean;
    error: string | null;
}

const useDocumentDownloader = (): UseDocumentDownloaderResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downloadDocument = async (url: string, filename: string): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Use the new Directory class for persistent storage
            const downloadsDir = new Directory(Paths.document, 'Downloads');
            await downloadsDir.create(); // Ensures the folder exists (idempotent)

            // Create the destination File object
            const destFile = new File(downloadsDir, filename);

            // Download using the NEW API – no deprecation, no warnings
            const downloadedFile = await File.downloadFileAsync(url, destFile, {
                idempotent: true, // Overwrite if file already exists
            });

            // Verify the download succeeded
            if (!downloadedFile.exists) {
                throw new Error('Download completed but file does not exist');
            }

            return downloadedFile.uri;
        } catch (err: any) {
            let message = 'Download failed';
            if (err.code === 'E_UNABLE_TO_DOWNLOAD') {
                message = `Unable to download: ${err.status || err.message}`;
            } else if (err.code === 'E_DESTINATION_ALREADY_EXISTS') {
                message = 'File already exists – try again';
            } else {
                message = err.message || message;
            }
            setError(message);
            console.error('[useDocumentDownloader]', message, err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { downloadDocument, isLoading, error };
};

export default useDocumentDownloader;