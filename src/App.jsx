import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Browse from './components/Browse';
import Library from './components/Library';
import NovelDetails from './components/NovelDetails';
import ChapterReader from './components/ChapterReader';
import Home from './components/Home';     
import Search from './components/Search'; 


function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#747bff' },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e2f' : '#ffffff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/novels/:id" element={<NovelDetails />} />
          <Route path="/novels/:novelId/:chapterId" element={<ChapterReader />} />
          
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App
