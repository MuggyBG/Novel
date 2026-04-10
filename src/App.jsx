import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Browse from './components/Browse';
import Library from './components/Library';
import NovelDetails from './components/NovelDetails';
import ChapterReader from './components/ChapterReader';
import Home from './components/Home';     
import Search from './components/Search'; 
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer'

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#747bff' },
      background: {
        default: darkMode ? '#121212' : '#a7cdd6',
        paper: darkMode ? '#1e1e2f' : '#ffffff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/browse/:pageNumber" element={<Browse />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/novels/:id" element={<NovelDetails />} />
          <Route path="/novels/:novelId/:chapterId" element={<ChapterReader />} />
          <Route path="/admin" element={<AdminRoute>
        <AdminDashboard />
      </AdminRoute>}/>
          <Route path="*" element={<Home />} />
        </Routes>
        
      </main>
      <Footer/>
      </Box>
    </ThemeProvider>
  );
}

export default App
