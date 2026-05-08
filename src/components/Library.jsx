import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Box, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const Library = () => {
  const [savedLibrary, setSavedLibrary] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const savedLibraryRaw = JSON.parse(localStorage.getItem('savedLibrary')) || {};
    const saved = Array.isArray(savedLibraryRaw)
      ? savedLibraryRaw
      : (user?.id ? savedLibraryRaw[user.id] || [] : []);
    setSavedLibrary(saved);

    const historyRaw = JSON.parse(localStorage.getItem('readingHistory')) || {};
    const historyObj = user?.id && historyRaw[user.id] ? historyRaw[user.id] : historyRaw;
    const historyArray = Object.values(historyObj).sort((a, b) => {
      return new Date(b.lastReadDate) - new Date(a.lastReadDate);
    });
    setReadingHistory(historyArray);
  }, []);

  if (!user) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="text.primary">
          Please sign in to view your library.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5, mb: 8, minHeight: '60vh' }}>
      <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
        Welcome back, {user.username}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Your personal reading dashboard.
      </Typography>

      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 1, mb: 5 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
          Continue Reading
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {readingHistory.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You haven't read any chapters yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {readingHistory.map(record => (
              <Grid item xs={12} sm={6} md={4} key={record.novelID}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap fontWeight="bold" color="text.primary">
                      {record.novelTitle}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ mt: 1, mb: 2 }}>
                      Reached: Chapter {record.chapterNumber}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      component={Link} 
                      to={`/novels/${record.novelID}/${record.chapterNumber}`}
                    >
                      Continue Reading
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
          Saved Novels
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {savedLibrary.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Your saved library is empty.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {savedLibrary.map(novel => (
              <Grid item xs={12} sm={6} md={3} key={novel.id}>
                <Card>
                  <CardActionArea component={Link} to={`/novels/${novel.novelID}`}>
                    <CardContent>
                      <Typography variant="h6" noWrap fontWeight="bold" color="text.primary">
                        {novel.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        By {novel.author}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Library;