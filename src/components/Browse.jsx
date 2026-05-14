import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Box, Pagination, CircularProgress } from '@mui/material';
import NovelCard from './NovelCard';

const Browse = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();

  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const currentPage = parseInt(pageNumber) || 1;
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const res = await fetch('http://localhost:5174/novels');
        const data = await res.json();

        const allNovels = data.data ? data.data : data;

        if (isMounted) {
          const startIndex = (currentPage - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedNovels = allNovels.reverse().slice(startIndex, endIndex);

          setNovels(paginatedNovels);
          setTotalCount(allNovels.length);
        }
      } catch (error) {
        console.error("Browse fetch failed", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [currentPage]);


  const handlePageChange = (event, value) => {
    navigate(`/browse/${value}`);
    window.scrollTo(0, 0);
  };

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
        Browse Novels
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 3,
              width: '100%'
            }}
          >
            {novels && novels.length > 0 ? (
              novels.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))
            ) : (
              <Typography variant="h6" sx={{ gridColumn: '1 / -1', textAlign: 'center', mt: 4 }}>
                No novels found.
              </Typography>
            )}
          </Box>

          {totalCount > limit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
              <Pagination
                count={Math.ceil(totalCount / limit)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Browse;