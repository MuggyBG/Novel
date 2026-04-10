import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { CardActionArea, CardMedia } from '@mui/material';
const Browse = () => {
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNovels = async () => {
            try {
                const response = await fetch('http://localhost:5174/novels');
                const data = await response.json();
                setNovels(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching novels:", error);
                setLoading(false);
            }
        };

        fetchNovels();
    }, []);

    return (

        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Browse Novels
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {novels.map((novel) => (
                        <Grid item key={novel.id} xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardActionArea component={Link} to={`/novels/${novel.id}`} sx={{ flexGrow: 1 }}>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={novel.coverImg}
                                        alt={novel.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
                                            {novel.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {novel.synopsis}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>

                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Button variant="contained" component={Link} to={`/novels/${novel.id}`} sx={{ bgcolor: '#747bff' }}>
                                        Read
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Browse;