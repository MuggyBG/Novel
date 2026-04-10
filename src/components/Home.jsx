import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import NovelCard from './NovelCard'; 

const Home = () => {
  const [latestNovels, setLatestNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    const fetchHomeNovels = async () => {
      try {
        const res = await fetch('http://localhost:5174/novels');
        const data = await res.json();
        
        const allNovels = data.data ? data.data : data;

        if (isMounted) {
          setLatestNovels(allNovels.slice(0, 8)); 
        }
      } catch (error) {
        console.error("Home fetch failed", error);
      } finally {
        if (isMounted) setLoading(false); 
      }
    };

    fetchHomeNovels();
    return () => { isMounted = false; };
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: 3,
            width: '100%'
          }}
        >
          {latestNovels.length > 0 ? (
            latestNovels.map(novel => (
              <NovelCard key={novel.id} novel={novel} />
            ))
          ) : (
            <Typography variant="h6" sx={{ gridColumn: '1 / -1', textAlign: 'center', mt: 4 }}>
              No novels found.
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Home;