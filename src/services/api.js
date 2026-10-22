// MSSV: BIT240043
// Link Base URL lấy từ project CourseHub của bạn (Không có /api/v1)
const BASE_URL = 'https://6ad38e5759dd78397bbbdaa1.mockapi.io';

// --- API CATEGORIES ---
export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Lỗi tải danh mục');
  return res.json();
};

export const addCategory = async (cat) => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat),
  });
  return res.json();
};

export const updateCategory = async (id, cat) => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat),
  });
  return res.json();
};

export const deleteCategory = async (id) => {
  await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
};

// --- API COURSES ---
export const getCourses = async () => {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error('Lỗi tải khóa học');
  return res.json();
};

export const addCourse = async (course) => {
  const res = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
  return res.json();
};

export const updateCourse = async (id, course) => {
  const res = await fetch(`${BASE_URL}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
  return res.json();
};

export const deleteCourse = async (id) => {
  await fetch(`${BASE_URL}/courses/${id}`, { method: 'DELETE' });
};