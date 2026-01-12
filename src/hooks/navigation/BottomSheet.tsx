import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { BottomSheetModal, BottomSheetView, useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';

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

const CustomBackdrop = ({ onPress }: { onPress: () => void }) => {
    const { animatedIndex, animatedPosition } = useBottomSheetInternal();

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 0.6],
            Extrapolate.CLAMP
        );

        return {
            opacity,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#000',
                },
                animatedStyle,
            ]}
            onTouchEnd={onPress}
        />
    );
};

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
                backgroundStyle={{ backgroundColor: '#fff' }}
                backdropComponent={() => <CustomBackdrop onPress={close} />}
            >
                <BottomSheetView style={{ flex: 1, padding: 16, minHeight: 300 }}>
                    {content}
                </BottomSheetView>
            </BottomSheetModal>
        </GlobalBottomSheetContext.Provider>
    );
};
