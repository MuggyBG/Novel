import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import NovelCard from './NovelCard'; 

const Home = () => {
  const [latestNovels, setLatestNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch('http://localhost:5174/novels?_sort=id&_order=desc&_limit=20')
    .then(res => res.json())
    .then(data => {
      const finalData = Array.isArray(data) ? data : (data.data || []);
      setLatestNovels(finalData);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
        Latest Updates
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Check out the most recently added novels on MugNovel.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {latestNovels.map(novel => (
            <Grid item xs={12} sm={6} md={3} key={novel.id}>
              <NovelCard novel={novel} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;