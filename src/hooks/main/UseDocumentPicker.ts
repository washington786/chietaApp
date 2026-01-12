import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import type { DocumentPickerResult } from 'expo-document-picker';

interface UseDocumentPickerResult {
    pickDocument: (options?: DocumentPicker.DocumentPickerOptions) => Promise<DocumentPickerResult | null>;
    isLoading: boolean;
    error: string | null;
}

const useDocumentPicker = (): UseDocumentPickerResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pickDocument = async (
        options: DocumentPicker.DocumentPickerOptions = { type: '*/*' }
    ): Promise<DocumentPickerResult | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await DocumentPicker.getDocumentAsync(options);
            if (!result.canceled) {
                return result;
            } else {
                // User cancelled - this is normal, don't set error
                console.log('User cancelled or no file selected');
                return null;
            }
        } catch (err: any) {
            const message = err.message || 'Failed to pick document';
            setError(message);
            console.error('[useDocumentPicker]', message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { pickDocument, isLoading, error };
};

export default useDocumentPicker;