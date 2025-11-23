import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Dimensions, Pressable } from 'react-native';

type OpenOptions = {
    snapPoints?: (string | number)[];
};

type GlobalBottomSheetContextType = {
    open: (content: React.ReactNode, options?: OpenOptions) => void;
    close: () => void;
};

const GlobalBottomSheetContext = createContext<GlobalBottomSheetContextType>({
    open: () => { },
    close: () => { },
});

export const useGlobalBottomSheet = () => useContext(GlobalBottomSheetContext);

export const GlobalBottomSheet = ({ children }: { children: React.ReactNode }) => {

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const [content, setContent] = useState<React.ReactNode>(null);
    const [snapPoints, setSnapPoints] = useState<(string | number)[]>(['50%']);
    const [pendingIndex, setPendingIndex] = useState<number | null>(null);

    const normalizeSnapPoints = (points: (string | number)[]) => {
        return points.map(p => {
            if (typeof p === 'string' && p.includes('%')) {
                const value = parseFloat(p.replace('%', '')) / 100;
                return Dimensions.get('window').height * value;
            }
            return p;
        });
    };

    const open = useCallback((newContent: React.ReactNode, options?: OpenOptions) => {
        setContent(newContent);

        const rawPoints = options?.snapPoints || ['50%'];
        const numeric = normalizeSnapPoints(rawPoints);

        setSnapPoints(numeric);

        setTimeout(() => {
            bottomSheetRef.current?.present(numeric.length - 1);
        }, 10);
    }, []);

    useEffect(() => {
        if (pendingIndex !== null && bottomSheetRef.current) {
            bottomSheetRef.current.present(pendingIndex);
            setPendingIndex(null);
        }
    }, [pendingIndex, snapPoints]);

    const close = () => {
        bottomSheetRef.current?.dismiss();
    };

    return (
        <GlobalBottomSheetContext.Provider value={{ open, close }}>
            {children}

            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                enablePanDownToClose={true}
                onDismiss={() => setContent(null)}
                backdropComponent={(props) => (
                    <Pressable
                        onPress={close}
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                        {...props}
                    />
                )}
            >
                <BottomSheetView style={{ flex: 1, padding: 16, minHeight: 300 }}>
                    {content}
                </BottomSheetView>
            </BottomSheetModal>
        </GlobalBottomSheetContext.Provider>
    );
};
