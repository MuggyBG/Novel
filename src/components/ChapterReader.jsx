import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, Paper, Breadcrumbs, CircularProgress, ButtonGroup 
} from '@mui/material';

const ChapterReader = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  
  const [novel, setNovel] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:5174/novels/${novelId}`).then(res => res.ok ? res.json() : null),
      fetch(`http://localhost:5174/chapters/${chapterId}`).then(res => res.ok ? res.json() : null)
    ])
    .then(([novelData, chapterData]) => {
      setNovel(novelData);
      setChapter(chapterData);
      setLoading(false);

      const user = localStorage.getItem('user');
      if (user && novelData && chapterData) {
        let history = JSON.parse(localStorage.getItem('readingHistory')) || {};
        
        const existingRecord = history[novelId];
        
        if (!existingRecord || chapterData.chapterNumber > existingRecord.chapterNumber) {
          history[novelId] = {
            novelId: novelData.id,
            novelTitle: novelData.title,
            coverImg: novelData.coverImg,
            chapterId: chapterData.id,
            chapterNumber: chapterData.chapterNumber,
            chapterTitle: chapterData.title,
            lastReadDate: new Date().toISOString()
          };
          localStorage.setItem('readingHistory', JSON.stringify(history));
        }
      }
    })
    .catch(error => {
      console.error("Error fetching chapter:", error);
      setLoading(false);
    });
  }, [novelId, chapterId]);

  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const resetSettings = () => { setFontSize(18); setIsDarkMode(true); };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!chapter) return <Typography align="center" mt={10} variant="h5">Chapter not found.</Typography>;

  const prevChapterId = String(parseInt(chapterId) - 1);
  const nextChapterId = String(parseInt(chapterId) + 1);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <Link to={`/novels/${novelId}`} style={{ color: 'inherit', textDecoration: 'none' }}>{novel?.title}</Link>
        <Typography color="text.primary">{chapter.title}</Typography>
      </Breadcrumbs>

      <Paper 
        sx={{ 
          p: { xs: 2, md: 5 }, 
          bgcolor: isDarkMode ? '#1e1e2f' : '#f5f5f5', 
          color: isDarkMode ? '#c8c8d0' : '#111111',
          minHeight: '100vh',
          transition: 'all 0.3s'
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: isDarkMode ? 'white' : 'black' }}>
            {chapter.title}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" mb={4}>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={increaseFont}>A+</Button>
            <Button onClick={decreaseFont}>A-</Button>
            <Button onClick={toggleTheme}>{isDarkMode ? '☀️ Light' : '🌙 Dark'}</Button>
            <Button onClick={resetSettings}>🔄 Reset</Button>
          </ButtonGroup>
        </Box>

        <Box sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {chapter.content}
        </Box>

        <Box display="flex" justifyContent="space-between" mt={8} pt={3} borderTop="1px solid #3f3f5a">
          <Button onClick={() => navigate(`/novels/${novelId}/${prevChapterId}`)}>« Prev</Button>
          <Button onClick={() => navigate(`/novels/${novelId}`)}>Index</Button>
          <Button onClick={() => navigate(`/novels/${novelId}/${nextChapterId}`)}>Next »</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChapterReader;