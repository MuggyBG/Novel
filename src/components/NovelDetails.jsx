import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Typography, Grid, Box, Button, Paper, 
  Chip, Divider, Breadcrumbs, CircularProgress, Snackbar, Alert 
} from '@mui/material';

const NovelDetails = () => {
  const { novelID } = useParams();
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const savedLibraryRaw = JSON.parse(localStorage.getItem('savedLibrary')) || {};
    const currentLibrary = Array.isArray(savedLibraryRaw)
      ? savedLibraryRaw
      : (user?.id ? savedLibraryRaw[user.id] || [] : []);
    setIsInLibrary(user ? currentLibrary.some(n => String(n.novelID) === String(novelID)) : false);

    setLoading(true);

    fetch('http://localhost:5174/novels')
      .then(res => res.ok ? res.json() : [])
      .then(fetchedData => {
        const novelArray = fetchedData.data ? fetchedData.data : fetchedData;
        const targetNovel = Array.isArray(novelArray)
          ? novelArray.find(n => String(n.novelID) === String(novelID))
          : null;

        if (targetNovel) {
          setNovel(targetNovel);
          return fetch('http://localhost:5174/chapters')
            .then(res => res.ok ? res.json() : [])
            .then(chaptersData => {
              const allChaptersArray = chaptersData.data ? chaptersData.data : chaptersData;
              const matchingChapters = allChaptersArray.filter(chapter => {
                const chNovelId = chapter.novelID || chapter.novelId;
                return String(chNovelId) === String(targetNovel.id);
              });
              setChapters(matchingChapters);
              setLoading(false);
            });
        }

        setNovel(null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setNovel(null);
        setLoading(false);
      });
  }, [novelID]);
  const toggleLibrary = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setToast({ open: true, message: 'Please sign in to manage your library!', severity: 'warning' });
      return;
    }

    let savedLibraryRaw = JSON.parse(localStorage.getItem('savedLibrary')) || {};
    let currentLibrary = Array.isArray(savedLibraryRaw)
      ? savedLibraryRaw
      : (savedLibraryRaw[user.id] || []);
    
    if (isInLibrary) {
      currentLibrary = currentLibrary.filter(n => String(n.novelID || n.id) !== String(novel.novelID || novel.id));
      setIsInLibrary(false);
      setToast({ open: true, message: 'Removed from Library', severity: 'info' });
    } else {
      currentLibrary.push(novel);
      setIsInLibrary(true);
      setToast({ open: true, message: 'Added to Library!', severity: 'success' });
    }
    if (Array.isArray(savedLibraryRaw)) {
      savedLibraryRaw = { [user.id]: currentLibrary };
    } else {
      savedLibraryRaw[user.id] = currentLibrary;
    }
    localStorage.setItem('savedLibrary', JSON.stringify(savedLibraryRaw));
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
  };

  if (loading) return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={60} /></Container>;
  
  if (!novel) return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" color="error" fontWeight="bold" gutterBottom>Novel Not Found</Typography>
      <Button component={Link} to="/browse" variant="contained" sx={{ mt: 4 }}>Back to Browse</Button>
    </Container>
  );

  // Updated sorting logic to strictly use chapterNumber
  const sortedChapters = [...chapters].sort((a, b) => {
    const numA = parseInt(a.chapterNumber);
    const numB = parseInt(b.chapterNumber);
    return sortAsc ? numA - numB : numB - numA;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <Link to="/browse" style={{ color: 'inherit', textDecoration: 'none' }}>Browse</Link>
        <Typography color="text.primary">{novel.title}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} md={3}>
            <img 
              src={novel.coverImg || 'https://via.placeholder.com/200x280?text=No+Cover'} 
              alt={`${novel.title} Cover`} 
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200x280?text=Image+Error'; }}
            />
          </Grid>

          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>{novel.title}</Typography>
            <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>Author: {novel.author} | Status: {novel.status}</Typography>
            <Box sx={{ mb: 3 }}>
              {novel.genres?.map(genre => <Chip key={genre} label={genre} sx={{ mr: 1, mb: 1 }} />)}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button variant="contained" color="primary" component={Link} to={`/novels/${novel.novelID}/${sortedChapters[0]?.chapterNumber || 1}`} disabled={sortedChapters.length === 0}>Read First Chapter</Button>
              <Button variant={isInLibrary ? "contained" : "outlined"} color={isInLibrary ? "error" : "primary"} onClick={toggleLibrary} sx={{ width: '200px' }}>
                {isInLibrary ? "Remove from Library" : "Add to Library"}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>Synopsis</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>{novel.synopsis}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} borderBottom="2px solid #747bff" pb={1}>
          <Typography variant="h5">Chapter List</Typography>
          <Button onClick={() => setSortAsc(!sortAsc)} size="small" color="inherit" variant="outlined">
            Sort: {sortAsc ? "Ascending ⬇" : "Descending ⬆"}
          </Button>
        </Box>
        <Grid container spacing={2}>
          {sortedChapters.map((chapter) => (
            <Grid item xs={12} sm={6} md={4} key={chapter.id}>
              <Box component={Link} to={`/novels/${novel.novelID}/${chapter.chapterNumber}`} sx={{ display: 'block', textDecoration: 'none', color: 'inherit', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: '4px', '&:hover': { bgcolor: 'action.hover', color: 'primary.main', borderColor: 'primary.main' }}}>
                <Typography noWrap>{chapter.title}</Typography>
              </Box>
            </Grid>
          ))}
          {sortedChapters.length === 0 && <Grid item xs={12}><Typography color="text.secondary">No chapters available yet.</Typography></Grid>}
        </Grid>
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default NovelDetails;