import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, Paper, Breadcrumbs, CircularProgress, ButtonGroup 
} from '@mui/material';

const ChapterReader = () => {
  const { novelID, chapterNumber } = useParams();
  const navigate = useNavigate();
  
  const [novel, setNovel] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false); 
  
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const chapterNum = chapterNumber;

  useEffect(() => {
    setLoading(true);
    setChapter(null);
    setHasNext(false);
    setHasPrev(false);

    let internalNovelId = null;

    fetch('http://localhost:5174/novels')
      .then(res => res.ok ? res.json() : [])
      .then(novelsData => {
        const novelsArray = novelsData.data ? novelsData.data : novelsData;
        const novelData = Array.isArray(novelsArray)
          ? novelsArray.find(n => String(n.novelID) === String(novelID))
          : null;
        internalNovelId = novelData?.id;
        setNovel(novelData);
        if (!novelData) {
          setLoading(false);
          return null;
        }
        return fetch(`http://localhost:5174/chapters`)
          .then(res => res.ok ? res.json() : []);
      })
      .then(allChaptersData => {
        if (!allChaptersData) return;
        
        const chapArray = allChaptersData.data ? allChaptersData.data : allChaptersData;
        
        // Filter chapters for this novel and build a map by chapterNumber
        const novelChaptersMap = {};
        if (Array.isArray(chapArray)) {
          chapArray.forEach(ch => {
            const chNovelId = ch.novelID || ch.novelId;
            if (String(chNovelId) === String(internalNovelId)) {
              novelChaptersMap[ch.chapterNumber] = ch;
            }
          });
        }
        
        // Find current chapter
        const currentChapter = novelChaptersMap[parseInt(chapterNum, 10)];
        setChapter(currentChapter || null);
        
        // Check if next chapter exists
        const nextChapterNum = parseInt(chapterNum, 10) + 1;
        setHasNext(Boolean(novelChaptersMap[nextChapterNum]));
        
        // Check if previous chapter exists
        const prevChapterNum = parseInt(chapterNum, 10) - 1;
        setHasPrev(prevChapterNum >= 1 && Boolean(novelChaptersMap[prevChapterNum]));
        
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching chapter:", error);
        setLoading(false);
      });
  }, [novelID, chapterNum]);

  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const resetSettings = () => { setFontSize(18); setIsDarkMode(true); };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!chapter) return <Typography align="center" mt={10} variant="h5">Chapter not found.</Typography>;

  const currentNum = parseInt(chapterNum);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <Link to={`/novels/${novelID}`} style={{ color: 'inherit', textDecoration: 'none' }}>{novel?.title}</Link>
        <Typography color="text.primary">{chapter.title}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 2, md: 5 }, bgcolor: isDarkMode ? '#1e1e2f' : '#f5f5f5', color: isDarkMode ? '#c8c8d0' : '#111111', minHeight: '100vh', transition: 'all 0.3s' }}>
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
          {/* Navigate using the clean URL chapter numbers */}
          <Button disabled={!hasPrev} onClick={() => navigate(`/novels/${novelID}/${currentNum - 1}`)}>
            « Prev
          </Button>
          <Button onClick={() => navigate(`/novels/${novelID}`)}>
            Index
          </Button>
          <Button disabled={!hasNext} onClick={() => navigate(`/novels/${novelID}/${currentNum + 1}`)}>
            Next »
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChapterReader;