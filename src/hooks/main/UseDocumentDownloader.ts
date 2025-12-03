import { useState } from 'react';
import * as FileSystem from 'expo-file-system';

interface UseDocumentDownloaderResult {
    downloadDocument: (url: string, filename: string) => Promise<string | null>;
    isLoading: boolean;
    error: string | null;
}

const useDocumentDownloader = (): UseDocumentDownloaderResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downloadDocument = async (url: string, filename: string) => {
        setIsLoading(true);
        setError(null);

        const fileUri = `${FileSystem.Directory}${filename}`;

        try {
            const downloadResumable = FileSystem.createDownloadResumable(
                url,
                fileUri,
                {},
                (downloadProgress) => {
                    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                    console.log(`Download progress: ${(progress * 100).toFixed(1)}%`);
                    // You can expose this via state if you want a progress bar
                }
            );

            const { uri } = await downloadResumable.downloadAsync();
            return uri ?? null;
        } catch (err: any) {
            setError(err.message || 'Download failed');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { downloadDocument, isLoading, error };
};

export default useDocumentDownloader;