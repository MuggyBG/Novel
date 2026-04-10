import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Typography, Grid, Box, Button, Paper, 
  Chip, Divider, Breadcrumbs, CircularProgress 
} from '@mui/material';

const NovelDetails = () => {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5174/novels/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Database offline or ID missing");
        return res.json();
      })
      .then(data => {
        if (Object.keys(data).length === 0) {
          setNovel(null);
        } else {
          setNovel(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching novel:", err);
        setNovel(null);
        setLoading(false);
      });
  }, [id]);

  const handleAddToLibrary = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please sign in to add to your library!');
      return;
    }
    const currentLibrary = JSON.parse(localStorage.getItem('library')) || [];
    if (!currentLibrary.find(n => n.id === novel?.id)) {
      currentLibrary.push(novel);
      localStorage.setItem('library', JSON.stringify(currentLibrary));
      alert('Added to Library!');
    } else {
      alert('Already in your Library!');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!novel) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h3" color="error" fontWeight="bold" gutterBottom>
          Novel Not Found
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We couldn't find a novel with the ID "{id}" in your database.
        </Typography>
        <Button component={Link} to="/browse" variant="contained" sx={{ mt: 4 }}>
          Back to Browse
        </Button>
      </Container>
    );
  }

  const safeChapters = novel?.chapters || [];
  const sortedChapters = [...safeChapters].sort((a, b) => 
    sortAsc ? a.id - b.id : b.id - a.id
  );

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
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              {novel.title}
            </Typography>
            
            <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
              Author: {novel.author} | Status: {novel.status}
            </Typography>

            <Box sx={{ mb: 3 }}>
              {novel.genres?.map(genre => (
                <Chip key={genre} label={genre} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                to={`/novels/${novel.id}/${sortedChapters[0]?.id || 1}`}
                disabled={sortedChapters.length === 0}
              >
                Read First Chapter
              </Button>
              <Button variant="outlined" color="primary" onClick={handleAddToLibrary}>
                Add to Library
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="h6" gutterBottom>Synopsis</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {novel.synopsis}
            </Typography>
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
              <Box 
                component={Link}
                to={`/novels/${novel.id}/${chapter.id}`}
                sx={{ 
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover', color: 'primary.main', borderColor: 'primary.main' }
                }}
              >
                <Typography noWrap>{chapter.title}</Typography>
              </Box>
            </Grid>
          ))}
          {sortedChapters.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary">No chapters available yet.</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default NovelDetails;