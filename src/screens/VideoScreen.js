// MSSV: BIT240043
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video'; // Dùng expo-video mới

export default function VideoScreen({ route, navigation }) {
  const { trailerUrl } = route.params;

  // Khởi tạo player với link video
  const player = useVideoPlayer(trailerUrl, player => {
    player.play(); // Tự động phát khi mở
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Đóng Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  video: { width: '100%', height: 300, backgroundColor: '#000' },
  closeBtn: { backgroundColor: '#e33', padding: 15, margin: 20, borderRadius: 8, alignItems: 'center' }
});