// MSSV: BIT240043
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, ScrollView } from 'react-native';
import { getCourses, getCategories } from '../services/api';

export default function CourseListScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // State cho bộ lọc danh mục
  const [selectedCat, setSelectedCat] = useState('ALL'); 

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [c, cats] = await Promise.all([getCourses(), getCategories()]);
      setCourses(c);
      setCategories(cats);
    } catch (err) {
      alert('Lỗi kết nối mạng!');
    } finally {
      setLoading(false);
    }
  };

  const getCatName = (catId) => {
    const cat = categories.find(x => x.id === catId);
    return cat ? cat.name : 'Không rõ';
  };

  // Logic Tìm kiếm + Lọc
  const filteredCourses = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'ALL' || c.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ flexDirection: 'row', padding: 10, gap: 10 }}>
        <TextInput 
          style={[styles.search, { flex: 1, margin: 0 }]} 
          placeholder="Tìm khóa học..." 
          value={search} 
          onChangeText={setSearch} 
        />
        <TouchableOpacity style={styles.btnCat} onPress={() => navigation.navigate('CategoryManager')}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Quản lý DM</Text>
        </TouchableOpacity>
      </View>

      {/* Thanh Lọc Theo Danh Mục */}
      <View style={{ height: 40, marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          <TouchableOpacity 
            style={[styles.filterChip, selectedCat === 'ALL' && styles.filterChipActive]}
            onPress={() => setSelectedCat('ALL')}
          >
            <Text style={{ color: selectedCat === 'ALL' ? '#fff' : '#333' }}>Tất cả</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.filterChip, selectedCat === cat.id && styles.filterChipActive]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <Text style={{ color: selectedCat === cat.id ? '#fff' : '#333' }}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Không có khóa học nào.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CourseDetail', { course: item, catName: getCatName(item.categoryId) })}>
            <Image source={{ uri: item.thumbnail }} style={styles.img} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>GV: {item.instructor}</Text>
              <Text style={styles.desc}>Loại: {getCatName(item.categoryId)}</Text>
              <Text style={styles.price}>{item.price ? item.price.toLocaleString() : 0} đ</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CourseForm')}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Thêm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  search: { padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  btnCat: { backgroundColor: '#337ab7', padding: 10, borderRadius: 8, justifyContent: 'center' },
  filterChip: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#ddd' },
  filterChipActive: { backgroundColor: '#337ab7', borderColor: '#337ab7' },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10, padding: 10, borderRadius: 8, elevation: 2 },
  img: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#eee' },
  title: { fontSize: 16, fontWeight: 'bold' },
  desc: { color: '#666', fontSize: 13, marginTop: 2 },
  price: { color: '#e33', fontWeight: 'bold', marginTop: 4 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#337ab7', padding: 14, borderRadius: 30, elevation: 5 }
});