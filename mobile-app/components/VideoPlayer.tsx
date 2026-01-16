
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

interface VideoPlayerProps {
    source: string | number; // URI string or require-d asset number
    style?: ViewStyle;
    resizeMode?: 'contain' | 'cover';
    shouldPlay?: boolean;
    isLooping?: boolean;
    useNativeControls?: boolean;
    playbackSpeed?: number;
    isMuted?: boolean;
}

export default function VideoPlayer({
    source,
    style,
    resizeMode = 'contain',
    shouldPlay = false,
    isLooping = false,
    useNativeControls = true,
    playbackSpeed = 1.0,
    isMuted = false,
}: VideoPlayerProps) {
    const player = useVideoPlayer(source, (player) => {
        player.loop = isLooping;
        player.playbackRate = playbackSpeed;
        player.muted = isMuted;
        // Ensure audio allows speed change (sometimes pitch correction limits speed on older devices)
        player.preservesPitch = true;
        if (shouldPlay) {
            player.play();
        }
    });

    // Enforce playback speed updates and persist them
    React.useEffect(() => {
        if (player) {
            player.playbackRate = playbackSpeed;
            player.muted = isMuted;

            // Re-apply speed when playback starts/resumes
            const subscription = player.addListener('playingChange', (isPlaying) => {
                if (isPlaying) {
                    // Small delay to ensure native player is ready to accept rate
                    setTimeout(() => {
                        player.playbackRate = playbackSpeed;
                    }, 100);
                }
            });

            return () => {
                subscription.remove();
            };
        }
    }, [player, playbackSpeed]);



    return (
        <View style={[styles.container, style]}>
            <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                contentFit={resizeMode}
                nativeControls={useNativeControls}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});
