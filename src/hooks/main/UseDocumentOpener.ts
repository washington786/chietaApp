import { useState } from 'react';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface UseDocumentOpenerResult {
    openDocument: (uri: string, mimeType?: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const useDocumentOpener = (): UseDocumentOpenerResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openDocument = async (uri: string, mimeType = 'application/pdf'): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            // Copy to cache (required for Android)
            const cacheUri = `${FileSystem.Directory}temp_open.${getFileExtension(uri)}`;
            await FileSystem.copyAsync({ from: uri, to: cacheUri });

            await Sharing.shareAsync(cacheUri, {
                mimeType,
                UTI: mimeType === 'application/pdf' ? 'com.adobe.pdf' : undefined,
                dialogTitle: 'Open Document',
            });
        } catch (err: any) {
            const message = err.message || 'Failed to open document';
            setError(message);
            console.error('[useDocumentOpener]', message);
        } finally {
            setIsLoading(false);
        }
    };

    return { openDocument, isLoading, error };
};

function getFileExtension(uri: string): string {
    return uri.split('.').pop()?.toLowerCase() || 'pdf';
}

export default useDocumentOpener;