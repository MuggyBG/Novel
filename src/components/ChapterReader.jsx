import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Breadcrumbs, CircularProgress, ButtonGroup } from '@mui/material';
import { getNovelById, getChaptersForNovel, API_ENDPOINTS } from "../utils/apiHelpers";

const ChapterReader = () => {
  const { novelID, chapterNumber } = useParams();
  const navigate = useNavigate();
  
  const [novel, setNovel] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false); 
  const [nextChapterNumber, setNextChapterNumber] = useState(null);
  const [prevChapterNumber, setPrevChapterNumber] = useState(null);
  
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const chapterNum = chapterNumber;

  useEffect(() => {
    setLoading(true);
    setChapter(null);
    setHasNext(false);
    setHasPrev(false);

    let internalNovelId = null;

    fetch(API_ENDPOINTS.novels)
      .then(res => res.ok ? res.json() : [])
      .then(novelsData => {
        const novelsArray = novelsData.data ? novelsData.data : novelsData;
        const novelData = Array.isArray(novelsArray)
          ? novelsArray.find(n => String(n.id) === String(novelID) || String(n.novelID) === String(novelID))
          : null;
        internalNovelId = novelData?.novelID;
        setNovel(novelData);
        if (!novelData) {
          setLoading(false);
          return null;
        }
        return fetch(API_ENDPOINTS.chapters)
          .then(res => res.ok ? res.json() : []);
      })
      .then(allChaptersData => {
        if (!allChaptersData) return;
        
        const chapArray = allChaptersData.data ? allChaptersData.data : allChaptersData;
        
        const novelChaptersMap = {};
        if (Array.isArray(chapArray)) {
          chapArray.forEach(ch => {
            const chNovelId = ch.novelID || ch.novelId;
            if (String(chNovelId) === String(internalNovelId)) {
              novelChaptersMap[ch.chapterNumber] = ch;
            }
          });
        }
        
        const currentChapter = novelChaptersMap[parseInt(chapterNum, 10)];
        setChapter(currentChapter || null);
        
        const chapterNumbers = Object.keys(novelChaptersMap)
          .map(num => parseInt(num, 10))
          .filter(num => !Number.isNaN(num))
          .sort((a, b) => a - b);
        const currentNumber = parseInt(chapterNum, 10);
        const nextNumber = chapterNumbers.find(num => num > currentNumber) || null;
        const prevNumber = [...chapterNumbers].reverse().find(num => num < currentNumber) || null;
        setHasNext(nextNumber !== null);
        setHasPrev(prevNumber !== null);
        setNextChapterNumber(nextNumber);
        setPrevChapterNumber(prevNumber);
        
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

  const routeNovelId = novel?.novelID;

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!chapter) return <Typography align="center" mt={10} variant="h5">Chapter not found.</Typography>;

  const currentNum = parseInt(chapterNum);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <Link to={`/novels/${routeNovelId}`} style={{ color: 'inherit', textDecoration: 'none' }}>{novel?.title}</Link>
        <Typography color="text.primary">{chapter.title}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 2, md: 5 }, bgcolor: isDarkMode ? '#1e1e2f' : '#f5f5f5', color: isDarkMode ? '#c8c8d0' : '#111111', minHeight: '100vh', transition: 'all 0.3s' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: isDarkMode ? 'white' : 'black' }}>
            {chapter.title}
          </Typography>
          <Box display="flex" justifyContent="center" width="100%">
            <ButtonGroup variant="outlined" size="small">
              <Button disabled={!hasPrev} onClick={() => navigate(`/novels/${routeNovelId}/${prevChapterNumber}`)}>
                « Prev
              </Button>
              <Button onClick={() => navigate(`/novels/${routeNovelId}`)}>
                Index
              </Button>
              <Button disabled={!hasNext} onClick={() => navigate(`/novels/${routeNovelId}/${nextChapterNumber}`)}>
                Next »
              </Button>
            </ButtonGroup>
          </Box>
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
          <Button disabled={!hasPrev} onClick={() => navigate(`/novels/${routeNovelId}/${prevChapterNumber}`)}>
            « Prev
          </Button>
          <Button onClick={() => navigate(`/novels/${routeNovelId}`)}>
            Index
          </Button>
          <Button disabled={!hasNext} onClick={() => navigate(`/novels/${routeNovelId}/${nextChapterNumber}`)}>
            Next »
          </Button>
        </Box>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          borderRadius: '50%',
          minWidth: 0,
          width: 52,
          height: 52,
          boxShadow: 3,
        }}
      >
        Top
      </Button>
    </Container>
  );
};

export default ChapterReader;