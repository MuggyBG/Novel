export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const getUserLibrary = () => {
  const user = getCurrentUser();
  const savedLibraryRaw = JSON.parse(localStorage.getItem('savedLibrary')) || {};
  
  return Array.isArray(savedLibraryRaw)
    ? savedLibraryRaw
    : (user?.id ? savedLibraryRaw[user.id] || [] : []);
};

export const saveUserLibrary = (library) => {
  const user = getCurrentUser();
  if (!user) return;
  
  const savedLibraryRaw = JSON.parse(localStorage.getItem('savedLibrary')) || {};
  
  if (Array.isArray(savedLibraryRaw)) {
    localStorage.setItem('savedLibrary', JSON.stringify(library));
  } else {
    savedLibraryRaw[user.id] = library;
    localStorage.setItem('savedLibrary', JSON.stringify(savedLibraryRaw));
  }
};

export const addToLibrary = (novel) => {
  const library = getUserLibrary();
  const novelExists = library.some(n => String(n.novelID || n.id) === String(novel.novelID || novel.id));
  
  if (!novelExists) {
    library.push(novel);
    saveUserLibrary(library);
    return true;
  }
  return false;
};

export const removeFromLibrary = (novelId) => {
  const library = getUserLibrary();
  const filtered = library.filter(n => String(n.novelID || n.id) !== String(novelId));
  saveUserLibrary(filtered);
  return library.length !== filtered.length;
};

export const isInLibrary = (novelId) => {
  const library = getUserLibrary();
  return library.some(n => String(n.novelID || n.id) === String(novelId));
};

export const getReadingHistory = () => {
  const user = getCurrentUser();
  const historyRaw = JSON.parse(localStorage.getItem('readingHistory')) || {};
  
  const historyObj = user?.id && historyRaw[user.id] ? historyRaw[user.id] : historyRaw;
  const historyArray = Object.values(historyObj).sort((a, b) => 
    new Date(b.lastReadDate) - new Date(a.lastReadDate)
  );
  
  return historyArray;
};

export const saveContinueReading = (novelData) => {
  const user = getCurrentUser();
  if (!user) return;
  
  const continueReading = JSON.parse(localStorage.getItem('continueReading')) || [];
  const index = continueReading.findIndex(n => String(n.novelID) === String(novelData.novelID));
  
  if (index >= 0) {
    continueReading[index] = novelData;
  } else {
    continueReading.push(novelData);
  }
  
  localStorage.setItem('continueReading', JSON.stringify(continueReading));
};

export const getNovelId = (novel) => novel?.id || novel?.novelID;
