import { useState } from 'react';
import { useSelector } from 'react-redux';
import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { RootState } from '@/store/store';

const API_BASE_URL = 'https://ims.chieta.org.za:22743';

interface DownloadByEntityParams {
    entityId: number;
    documentType: string;
    module: string;
    userId: number;
}

interface UseDocumentDownloaderResult {
    downloadDocument: (url: string, filename: string) => Promise<string | null>;
    downloadById: (documentId: number, filename: string) => Promise<string | null>;
    downloadByEntity: (params: DownloadByEntityParams, filename: string) => Promise<string | null>;
    isLoading: boolean;
    error: string | null;
}

const useDocumentDownloader = (): UseDocumentDownloaderResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    const downloadDocument = async (url: string, filename: string): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Download to cache first (writable, quota-free, cross-platform)
            const cacheDir = new Directory(Paths.cache, 'DocDownloads');
            if (!cacheDir.exists) {
                await cacheDir.create();
            }

            const destFile = new File(cacheDir, filename);

            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const downloadedFile = await File.downloadFileAsync(url, destFile, {
                idempotent: true,
                ...(Object.keys(headers).length > 0 ? { headers } : {}),
            });

            if (!downloadedFile.exists) {
                throw new Error('Download completed but file does not exist');
            }

            // Open the native share/save sheet so the user can save it to
            // Downloads, Files, Google Drive, etc. This is the only reliable
            // cross-platform way to get a file into user-visible storage.
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(downloadedFile.uri, {
                    dialogTitle: `Save ${filename}`,
                    UTI: getMimeUTI(filename).uti,
                    mimeType: getMimeUTI(filename).mime,
                });
            }

            return downloadedFile.uri;
        } catch (err: any) {
            // User dismissed the share sheet — not an error
            if (
                err?.message?.includes('User did not share') ||
                err?.message?.includes('dismissed') ||
                err?.code === 'E_ACTIVITY_DOES_NOT_EXIST'
            ) {
                return 'dismissed';
            }
            let message = 'Download failed';
            if (err.code === 'E_UNABLE_TO_DOWNLOAD') {
                message = `Unable to download: ${err.status || err.message}`;
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

    /** Resolve mime type and UTI from filename extension */
    const getMimeUTI = (filename: string): { mime: string; uti: string } => {
        const ext = filename.split('.').pop()?.toLowerCase() ?? '';
        const map: Record<string, { mime: string; uti: string }> = {
            pdf: { mime: 'application/pdf', uti: 'com.adobe.pdf' },
            doc: { mime: 'application/msword', uti: 'com.microsoft.word.doc' },
            docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uti: 'org.openxmlformats.wordprocessingml.document' },
            xls: { mime: 'application/vnd.ms-excel', uti: 'com.microsoft.excel.xls' },
            xlsx: { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uti: 'org.openxmlformats.spreadsheetml.sheet' },
            png: { mime: 'image/png', uti: 'public.png' },
            jpg: { mime: 'image/jpeg', uti: 'public.jpeg' },
            jpeg: { mime: 'image/jpeg', uti: 'public.jpeg' },
        };
        return map[ext] ?? { mime: 'application/octet-stream', uti: 'public.data' };
    };

    /** Download a single document by its numeric ID */
    const downloadById = (documentId: number, filename: string): Promise<string | null> => {
        const url = `${API_BASE_URL}/api/services/app/Account/DownloadFile?id=${documentId}`;
        return downloadDocument(url, filename);
    };

    /** Download the first matching document by entity + type + module */
    const downloadByEntity = (
        { entityId, documentType, module, userId }: DownloadByEntityParams,
        filename: string,
    ): Promise<string | null> => {
        const url =
            `${API_BASE_URL}/api/services/app/Documents/DownloadByEntity` +
            `?entityId=${entityId}` +
            `&documentType=${encodeURIComponent(documentType)}` +
            `&module=${encodeURIComponent(module)}` +
            `&userId=${userId}`;
        return downloadDocument(url, filename);
    };

    return { downloadDocument, downloadById, downloadByEntity, isLoading, error };
};

export default useDocumentDownloader;