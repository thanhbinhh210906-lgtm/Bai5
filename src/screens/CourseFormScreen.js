// MSSV: BIT240043
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { getCategories, addCourse, updateCourse } from '../services/api';

export default function CourseFormScreen({ route, navigation }) {
  const existingCourse = route.params?.course;
  const isEdit = !!existingCourse;

  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    title: existingCourse?.title || '',
    description: existingCourse?.description || '',
    categoryId: existingCourse?.categoryId || '',
    instructor: existingCourse?.instructor || '',
    price: existingCourse?.price ? String(existingCourse.price) : '',
    duration: existingCourse?.duration ? String(existingCourse.duration) : '',
    thumbnail: existingCourse?.thumbnail || '',
    trailerUrl: existingCourse?.trailerUrl || '',
  });

  // Khởi tạo player cho video xem trước
  const player = useVideoPlayer(form.trailerUrl || '', player => {
    player.muted = true; // Tắt tiếng khi xem trước
  });

  // Cập nhật player khi URL thay đổi
  useEffect(() => {
    if (form.trailerUrl && form.trailerUrl.startsWith('http')) {
      // Dùng setTimeout để đợi người dùng ngừng gõ 500ms mới load video, tránh lỗi AbortError
      const timer = setTimeout(() => {
        player.replaceAsync(form.trailerUrl).catch((e) => {
          console.log('Lỗi load video:', e); // Bỏ qua lỗi load video
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [form.trailerUrl]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setErrorMsg('Lỗi tải danh mục'));
  }, []);

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setErrorMsg('');
    if (!form.title.trim() || !form.instructor.trim() || !form.categoryId) {
      return setErrorMsg('Vui lòng nhập đủ Tên, Giảng viên, Danh mục.');
    }
    if (Number(form.price) < 0) {
      return setErrorMsg('Học phí không được âm.');
    }

    const payload = {
      ...form,
      price: Number(form.price || 0),
      duration: Number(form.duration || 0),
    };

    try {
      if (isEdit) {
        await updateCourse(existingCourse.id, payload);
      } else {
        await addCourse(payload);
      }
      navigation.goBack();
    } catch (err) {
      setErrorMsg('Lỗi kết nối đến MockAPI, không thể lưu!');
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      {errorMsg ? <Text style={styles.errorBox}>{errorMsg}</Text> : null}

      <Text style={styles.label}>Tên khóa học (*)</Text>
      <TextInput style={styles.input} value={form.title} onChangeText={v => setField('title', v)} />

      <Text style={styles.label}>Giảng viên (*)</Text>
      <TextInput style={styles.input} value={form.instructor} onChangeText={v => setField('instructor', v)} />

      <Text style={styles.label}>Danh mục (*)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        {categories.map(cat => (
          <TouchableOpacity 
            key={cat.id} 
            style={[styles.chip, form.categoryId === cat.id && styles.chipActive]}
            onPress={() => setField('categoryId', cat.id)}
          >
            <Text style={{ color: form.categoryId === cat.id ? '#fff' : '#333' }}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Học phí (VNĐ)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={form.price} onChangeText={v => setField('price', v)} />

      <Text style={styles.label}>Thời lượng (giờ)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={form.duration} onChangeText={v => setField('duration', v)} />

      <Text style={styles.label}>URL Ảnh bìa</Text>
      <TextInput style={styles.input} value={form.thumbnail} onChangeText={v => setField('thumbnail', v)} />
      {form.thumbnail ? <Image source={{ uri: form.thumbnail }} style={styles.previewImg} /> : null}

      {/* PHẦN VIDEO ĐÃ XÓA NÚT THƯ VIỆN, CHỈ CÒN URL */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <Text style={styles.label}>URL Video Trailer (MP4)</Text>
        <TouchableOpacity onPress={() => setField('trailerUrl', 'https://www.w3schools.com/html/mov_bbb.mp4')}>
          <Text style={{ color: '#337ab7', fontWeight: 'bold' }}>Dùng link mẫu</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} value={form.trailerUrl} onChangeText={v => setField('trailerUrl', v)} placeholder="Dán URL video MP4..." />
      
      {/* Khung xem trước video - Chỉ hiện khi URL bắt đầu bằng http */}
      {form.trailerUrl && form.trailerUrl.startsWith('http') ? (
        <View style={{ marginBottom: 15, borderRadius: 8, overflow: 'hidden', backgroundColor: '#000' }}>
          <VideoView player={player} style={{ width: '100%', height: 200 }} allowsFullscreen />
        </View>
      ) : null}

      <Text style={styles.label}>Mô tả</Text>
      <TextInput style={[styles.input, { height: 80 }]} multiline value={form.description} onChangeText={v => setField('description', v)} />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lưu</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  chip: { padding: 8, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  chipActive: { backgroundColor: '#337ab7' },
  previewImg: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  saveBtn: { backgroundColor: '#337ab7', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  errorBox: { backgroundColor: '#ffdddd', color: 'red', padding: 10, borderRadius: 8, marginBottom: 10, fontWeight: 'bold' }
});