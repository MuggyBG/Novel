import React, { useState, useEffect } from 'react';
import { Container, TextField, Grid, Card, CardActionArea, Typography, CardContent, CircularProgress, Box } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);
    
    fetch(`http://localhost:5174/novels`)
      .then(res => res.json())
      .then(data => {
        const actualNovels = Array.isArray(data) ? data : (data.data || []);
        const lowerCaseQuery = query.toLowerCase();
        const filteredNovels = actualNovels.filter(novel => {
          const matchTitle = novel.title?.toLowerCase().includes(lowerCaseQuery);
          const matchAuthor = novel.author?.toLowerCase().includes(lowerCaseQuery);
          const matchGenre = novel.genres?.some(g => g.toLowerCase().includes(lowerCaseQuery));
          
          return matchTitle || matchAuthor || matchGenre;
        });
        
        setResults(filteredNovels);
        setLoading(false);
      })
      .catch(err => {
        console.error("Search fetch error:", err);
        setLoading(false);
      });
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setSearchParams({ q: e.target.value });
  };

  return (
    <Container sx={{ mt: 5, mb: 8, minHeight: '60vh' }}>
      <TextField 
        fullWidth 
        variant="outlined" 
        label="Search novels by title, author, or genre..." 
        value={query} 
        onChange={handleSearchChange} 
        sx={{ mb: 4 }}
      />
      
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && query && results.length === 0 && (
        <Typography variant="h6" color="text.secondary" align="center" mt={4}>
          No results found matching "{query}"
        </Typography>
      )}

      <Grid container spacing={3}>
        {results.map(novel => (
          <Grid item xs={12} sm={6} md={3} key={novel.id}>
            <Card>
              <CardActionArea component={Link} to={`/novels/${novel.id}`}>
                <CardContent>
                  <Typography variant="h6" noWrap fontWeight="bold">{novel.title}</Typography>
                  <Typography variant="body2" color="text.secondary">By {novel.author}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Search;