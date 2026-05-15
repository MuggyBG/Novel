import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        px: 2, 
        mt: 'auto',
        bgcolor: 'background.paper', 
        color: 'text.secondary',
        borderTop: '1px solid',
        borderColor: 'divider' 
      }}
    >
      <Typography variant="body2" align="center">
        {new Date().getFullYear()} My Novel Site which can hopefully be used in the future? We'll see. No rights reserved. <br/>
        Made with many 🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺.
      </Typography>
    </Box>
  );
};

export default Footer;