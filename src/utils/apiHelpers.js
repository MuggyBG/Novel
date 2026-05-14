export const API_BASE_URL = 'http://localhost:5174';

export const API_ENDPOINTS = {
  novels: `${API_BASE_URL}/novels`,
  chapters: `${API_BASE_URL}/chapters`,
  users: `${API_BASE_URL}/users`,
};

export const getNovelById = async (novelID) => {
  try {
    const res = await fetch(API_ENDPOINTS.novels);
    const data = await res.json();
    const novelArray = data.data ? data.data : data;
    return Array.isArray(novelArray)
      ? novelArray.find(n => String(n.id) === String(novelID) || String(n.novelID) === String(novelID))
      : null;
  } catch (err) {
    console.error("Error fetching novel:", err);
    return null;
  }
};

export const getAllNovels = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.novels);
    const data = await res.json();
    return data.data ? data.data : data;
  } catch (err) {
    console.error("Error fetching novels:", err);
    return [];
  }
};

export const getChaptersForNovel = async (novelId) => {
  try {
    const res = await fetch(API_ENDPOINTS.chapters);
    const data = await res.json();
    const chaptersArray = data.data ? data.data : data;
    return Array.isArray(chaptersArray)
      ? chaptersArray.filter(ch => String(ch.novelID || ch.novelId) === String(novelId))
      : [];
  } catch (err) {
    console.error("Error fetching chapters:", err);
    return [];
  }
};
