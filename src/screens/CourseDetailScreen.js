// MSSV: BIT240043
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { deleteCourse } from '../services/api';

export default function CourseDetailScreen({ route, navigation }) {
  const { course, catName } = route.params;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Custom Confirm

  const executeDelete = async () => {
    try {
      await deleteCourse(course.id);
      setShowDeleteConfirm(false);
      navigation.goBack();
    } catch(e) { 
      alert('Lỗi xóa khóa học'); 
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.thumbnail }} style={styles.img} />
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.meta}>Giảng viên: {course.instructor}</Text>
      <Text style={styles.meta}>Danh mục: {catName}</Text>
      <Text style={styles.meta}>Học phí: {course.price?.toLocaleString()} đ</Text>
      <Text style={styles.meta}>Thời lượng: {course.duration} giờ</Text>
      <Text style={styles.desc}>{course.description}</Text>

      {/* Nút xem trailer chuyển sang màn hình khác */}
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Video', { trailerUrl: course.trailerUrl })}>
        <Text style={styles.btnText}>▶ Xem Trailer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: '#f0ad4e' }]} onPress={() => navigation.navigate('CourseForm', { course })}>
        <Text style={styles.btnText}>Sửa Khóa Học</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: '#d9534f' }]} onPress={() => setShowDeleteConfirm(true)}>
        <Text style={styles.btnText}>Xóa Khóa Học</Text>
      </TouchableOpacity>

      {/* Hộp thoại xác nhận xóa tự chế (Chạy tốt trên Web) */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.confirmBg}>
          <View style={styles.confirmBox}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Xác nhận xóa</Text>
            <Text style={{ marginBottom: 20 }}>Bạn có chắc chắn muốn xóa khóa học này?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#ccc' }]} onPress={() => setShowDeleteConfirm(false)}>
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#d9534f' }]} onPress={executeDelete}>
                <Text style={{ color: '#fff' }}>Đồng ý xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  img: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16, backgroundColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  meta: { fontSize: 14, color: '#333', marginBottom: 4 },
  desc: { marginTop: 10, fontSize: 14, color: '#555', lineHeight: 20 },
  btn: { backgroundColor: '#337ab7', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  
  confirmBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  confirmBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  confirmBtn: { padding: 10, borderRadius: 6, flex: 1, marginHorizontal: 5, alignItems: 'center' }
});