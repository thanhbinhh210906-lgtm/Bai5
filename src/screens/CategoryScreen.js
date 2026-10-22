// MSSV: BIT240043
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native';
import { getCategories, getCourses, addCategory, updateCategory, deleteCategory } from '../services/api';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState(null);

  // State cho Modal Xóa & Cảnh báo
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => { fetchData(); }, []);
  
  const fetchData = async () => {
    try {
      const [c, co] = await Promise.all([getCategories(), getCourses()]);
      setCategories(c); setCourses(co);
    } catch(e) { Alert.alert('Lỗi', 'Không thể tải dữ liệu'); }
  };

  const handleSave = async () => {
    if (!newName.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
    
    try {
      if (editingId) {
        await updateCategory(editingId, { name: newName, description: newDesc });
      } else {
        await addCategory({ name: newName, description: newDesc });
      }
      setNewName(''); setNewDesc(''); setEditingId(null);
      fetchData();
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể lưu danh mục');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setNewName(cat.name);
    setNewDesc(cat.description || '');
  };

  const handleDeleteClick = (catId) => {
    // 1. Kiểm tra ràng buộc: Không xóa nếu có khóa học sử dụng
    const isUsed = courses.some(c => c.categoryId === catId);
    if (isUsed) {
      setShowError(true); // Hiện Modal báo lỗi
      return;
    }
    // 2. Nếu không có khóa học thì hiện Modal xác nhận xóa
    setDeleteId(catId);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    try {
      await deleteCategory(deleteId);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server để xóa');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <View style={styles.addBox}>
        <TextInput placeholder="Tên danh mục" style={styles.input} value={newName} onChangeText={setNewName} />
        <TextInput placeholder="Mô tả" style={styles.input} value={newDesc} onChangeText={setNewDesc} />
        
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={handleSave}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editingId ? 'Cập nhật' : 'Thêm mới'}</Text>
          </TouchableOpacity>
          {editingId && (
             <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: '#888' }]} onPress={() => { setEditingId(null); setNewName(''); setNewDesc(''); }}>
               <Text style={{ color: '#fff', fontWeight: 'bold' }}>Hủy</Text>
             </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
              <Text style={{ color: '#666' }}>{item.description}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity onPress={() => handleEdit(item)}><Text style={{ color: 'blue', fontWeight: 'bold' }}>Sửa</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteClick(item.id)}><Text style={{ color: 'red', fontWeight: 'bold' }}>Xóa</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Hộp thoại Xác nhận Xóa */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Xác nhận xóa</Text>
            <Text style={{ marginBottom: 20 }}>Bạn có chắc chắn muốn xóa danh mục này?</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={() => setShowDeleteConfirm(false)}>
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#e33' }]} onPress={executeDelete}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Hộp thoại Cảnh báo Không thể xóa (Đang có khóa học) */}
      <Modal visible={showError} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#e33' }}>Không thể xóa</Text>
            <Text style={{ marginBottom: 20 }}>Danh mục này đang có khóa học sử dụng. Vui lòng xóa khóa học trước!</Text>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#337ab7' }]} onPress={() => setShowError(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đã hiểu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addBox: { marginBottom: 16, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
  input: { backgroundColor: '#fff', padding: 10, marginBottom: 8, borderRadius: 6, borderWidth: 1, borderColor: '#ccc' },
  btn: { backgroundColor: '#337ab7', padding: 12, alignItems: 'center', borderRadius: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalBtn: { padding: 10, borderRadius: 6, flex: 1, alignItems: 'center', marginHorizontal: 5 }
});