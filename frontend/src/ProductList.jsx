import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';

function ProductList({ columns = 5 }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { token, role } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Only allow save if admin
  const handleSave = (product) => {
    if (role?.toLowerCase() !== 'admin') {
      alert('Only admin can add or edit products.');
      return;
    }
    const method = product.id ? "PUT" : "POST";
    const url = product.id
      ? `http://localhost:8080/api/products/${product.id}`
      : "http://localhost:8080/api/products";
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save product");
        return res.json();
      })
      .then(() => {
        setShowForm(false);
        setEditProduct(null);
        fetchProducts();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>

      {selectedProduct ? (
        <ProductDetails product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      ) : showForm ? (
        <ProductForm
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditProduct(null); }}
          initialData={editProduct}
        />
      ) : loading ? (
        <Box sx={{textAlign:'center',py:6}}>Loading...</Box>
      ) : error ? (
        <Box sx={{color:'red',textAlign:'center',py:6}}>{error}</Box>
      ) : (
        <>
          {token && role?.toLowerCase() === 'admin' && (
            <Button variant="contained" sx={{mb:3, background:'#f1641e', '&:hover':{background:'#d35400'}}} onClick={handleAdd}>
              Add Product
            </Button>
          )}
          <Grid container spacing={4} sx={{width:'100%', margin:0}}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-6px)', boxShadow: 6, borderColor: '#f1641e' }
                  }}
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.imageUrl && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.imageUrl}
                      alt={product.name}
                      sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                    />
                  )}
                  <CardContent sx={{ pb: 0 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{fontWeight:600}}>
                      {product.name}
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{fontWeight:500, color:'#f1641e'}}>
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.stock} in stock
                    </Typography>
                  </CardContent>
                  <CardActions sx={{pb:2, pt:1}}>
                    <Button size="small" color="primary" startIcon={<AddShoppingCartIcon />} onClick={e => { e.stopPropagation(); addToCart(product); }}>
                      Add to Cart
                    </Button>
                    {token && role?.toLowerCase() === 'admin' && (
                      <Button size="small" color="secondary" startIcon={<EditIcon />} onClick={e => { e.stopPropagation(); setEditProduct(product); setShowForm(true); }}>
                        Edit
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}

export default ProductList;
