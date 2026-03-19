import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetFlatList, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';

// Re-export gorhom scroll-aware components so callers don't need to import gorhom directly
export { BottomSheetScrollView, BottomSheetFlatList };

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
    const [snapPoints, setSnapPoints] = useState<(string | number)[]>(['90%']);

    const open = useCallback((newContent: React.ReactNode, options?: OpenOptions) => {
        const points = options?.snapPoints ?? ['90%'];
        setSnapPoints(points);
        setContent(newContent);
        setTimeout(() => {
            bottomSheetRef.current?.present();
        }, 50);
    }, []);

    const close = useCallback(() => {
        bottomSheetRef.current?.dismiss();
    }, []);

    return (
        <GlobalBottomSheetContext.Provider value={{ open, close }}>
            {children}

            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={snapPoints.length - 1}
                enableDynamicSizing={false}
                enablePanDownToClose={true}
                onDismiss={() => setContent(null)}
                backgroundStyle={{ backgroundColor: '#fff' }}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" opacity={0.6} />
                )}
            >
                {content}
            </BottomSheetModal>
        </GlobalBottomSheetContext.Provider>
    );
};

const styles = StyleSheet.create({});
