import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { COLORS, RADIUS } from '../theme/tokens';

type SkeletonBoxProps = {
    style?: StyleProp<ViewStyle>;
};

export function SkeletonBox({ style }: SkeletonBoxProps) {
    const opacity = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.45,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [opacity]);

    return <Animated.View pointerEvents="none" style={[styles.box, { opacity }, style]} />;
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: COLORS.borderSubtle,
        borderRadius: RADIUS.small,
    },
});
