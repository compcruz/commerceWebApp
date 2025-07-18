import React from "react";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function ProductDetails({ product, onBack }) {
  if (!product) return null;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', py: 4 }}>
      <Card sx={{ maxWidth: 700, width: '100%', p: { xs: 1, md: 3 }, borderRadius: 4, boxShadow: 6, bgcolor: '#fff7f0', position: 'relative' }}>
        <Button onClick={onBack} variant="outlined" sx={{ position: 'absolute', top: 16, left: 16, background: '#fff', color: '#f1641e', borderColor: '#f1641e', fontWeight: 600, '&:hover': { background: '#ffe6d6', borderColor: '#f1641e' } }}>
          Back
        </Button>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4, mt: 4 }}>
          {product.imageUrl && (
            <CardMedia
              component="img"
              image={product.imageUrl}
              alt={product.name}
              sx={{ width: { xs: '100%', md: 300 }, height: 300, objectFit: 'cover', borderRadius: 3, boxShadow: 2, mb: { xs: 2, md: 0 } }}
            />
          )}
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#f1641e' }}>{product.name}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>${product.price}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><b>Stock:</b> {product.stock}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Description</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#333' }}>{product.description}</Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}

export default ProductDetails;
