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
    const fetchChapterData = async () => {
      try {
        const novelRes = await fetch(`http://localhost:5174/novels/${novelId}`);
        const novelData = await novelRes.json();
        setNovel(novelData);

        const chapterRes = await fetch(`http://localhost:5174/chapterContent/${chapterId}`);
        const chapterData = await chapterRes.json();
        setChapter(chapterData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching chapter:", error);
        setLoading(false);
      }
    };
    fetchChapterData();
  }, [novelId, chapterId]);

  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const resetSettings = () => {
    setFontSize(18);
    setIsDarkMode(true);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (!chapter) return <Typography align="center" mt={5} color="white">Chapter not found.</Typography>;

  const currentChapterIndex = novel?.chapters?.findIndex(c => c.id === chapterId);
  const prevChapter = novel?.chapters[currentChapterIndex - 1];
  const nextChapter = novel?.chapters[currentChapterIndex + 1];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      
      <Breadcrumbs sx={{ color: '#a9a9bc', mb: 3 }}>
        <Link to="/" style={{ color: '#a9a9bc', textDecoration: 'none' }}>Home</Link>
        <Link to={`/novel/${novelId}`} style={{ color: '#a9a9bc', textDecoration: 'none' }}>
          {novel?.title}
        </Link>
        <Typography color={isDarkMode ? "white" : "textPrimary"}>{chapter.title}</Typography>
      </Breadcrumbs>

      <Paper 
        sx={{ 
          p: { xs: 2, md: 5 }, 
          bgcolor: isDarkMode ? '#1e1e2f' : '#f5f5f5', 
          color: isDarkMode ? '#c8c8d0' : '#111111',
          minHeight: '100vh',
          transition: 'background-color 0.3s, color 0.3s'
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: isDarkMode ? 'white' : 'black' }}>
            {chapter.title}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#747bff' }}>
            Name: <Link to={`/novel/${novelId}`} style={{ color: '#747bff', textDecoration: 'none' }}>{novel?.title}</Link> | Author: {novel?.author}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" mb={4}>
          <ButtonGroup variant="outlined" size="small" sx={{ '& .MuiButton-root': { borderColor: '#747bff', color: '#747bff' } }}>
            <Button onClick={increaseFont}>A+</Button>
            <Button onClick={decreaseFont}>A-</Button>
            <Button onClick={toggleTheme}>{isDarkMode ? '💡 Turn On Light' : '🌙 Turn Off Light'}</Button>
            <Button onClick={resetSettings}>🔄 Reset</Button>
          </ButtonGroup>
        </Box>

        <Box 
          sx={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap' 
          }}
        >
          {chapter.content}
        </Box>

        <Box display="flex" justifyContent="space-between" mt={8} pt={3} borderTop="1px solid #3f3f5a">
          <Button 
            disabled={!prevChapter} 
            onClick={() => navigate(`/novel/${novelId}/chapter/${prevChapter?.id}`)}
            sx={{ color: '#747bff' }}
          >
            &laquo; Previous
          </Button>
          
          <Button 
            onClick={() => navigate(`/novel/${novelId}`)}
            sx={{ color: '#747bff' }}
          >
            Index
          </Button>

          <Button 
            disabled={!nextChapter} 
            onClick={() => navigate(`/novel/${novelId}/chapter/${nextChapter?.id}`)}
            sx={{ color: '#747bff' }}
          >
            Next &raquo;
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChapterReader;