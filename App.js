// MSSV: BIT240043 - CourseManager
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseListScreen from './src/screens/CourseListScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import CourseFormScreen from './src/screens/CourseFormScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import VideoScreen from './src/screens/VideoScreen'; // Import VideoScreen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CourseList" component={CourseListScreen} options={{ title: 'Danh Sách Khóa Học' }} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Chi Tiết Khóa Học' }} />
        <Stack.Screen name="CourseForm" component={CourseFormScreen} options={{ title: 'Thêm/Sửa Khóa Học' }} />
        <Stack.Screen name="CategoryManager" component={CategoryScreen} options={{ title: 'Quản Lý Danh Mục' }} />
        
        {/* Đưa Video vào TRONG Navigator và thêm màu nền đen cho đẹp */}
        <Stack.Screen 
          name="Video" 
          component={VideoScreen} 
          options={{ 
            title: 'Video Trailer', 
            headerStyle: { backgroundColor: '#000' }, 
            headerTintColor: '#fff' 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}