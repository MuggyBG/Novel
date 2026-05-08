import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActionArea, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NovelCard = ({ novel }) => {
  const navigate = useNavigate();
  const routeId = novel.id || novel.novelID;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.03)' }
      }}
    >
      <CardActionArea 
        onClick={() => navigate(`/novels/${routeId}`)} 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch' 
        }}
      >
        <CardMedia
          component="img"
          height="280"
          image={novel.coverImg || 'https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png'}
          alt={novel.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', p: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1rem',
              lineHeight: '1.2em',
              height: '2.4em', 
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1
            }}
          >
            {novel.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" noWrap>
            {novel.author}
          </Typography>
          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {novel.genres?.slice(0, 2).map((genre, index) => (
              <Chip 
                key={index} 
                label={genre} 
                size="small" 
                variant="outlined" 
                sx={{ fontSize: '0.7rem', height: '20px' }} 
              />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NovelCard;