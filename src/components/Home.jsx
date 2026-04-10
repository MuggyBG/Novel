import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5174/novels?_limit=4')
      .then(res => res.json())
      .then(data => setFeatured(data));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>Welcome to NovelHaven</Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>Hand-picked recommendations for you.</Typography>
      
      <Grid container spacing={4}>
        {featured.map((novel) => (
          <Grid item key={novel.id} xs={12} md={4}>
            <Card>
              <CardActionArea component={Link} to={`/novel/${novel.id}`}>
                <CardMedia component="img" height="300" image={novel.coverImg} />
                <CardContent>
                  <Typography variant="h5" fontWeight="bold">{novel.title}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default Home;