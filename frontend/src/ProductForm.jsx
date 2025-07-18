import React, { useState, useEffect } from "react";

import { useAuth } from "./AuthContext";

function ProductForm({ onSave, onCancel, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [stock, setStock] = useState(initialData?.stock || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [error, setError] = useState(null);
  const { role } = useAuth();
  if (role?.toLowerCase() !== 'admin') {
    return <div style={{color:'red',textAlign:'center',padding:32}}>Only admin can add or edit products.</div>;
  }

  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setPrice(initialData?.price || "");
    setStock(initialData?.stock || "");
    setImageUrl(initialData?.imageUrl || "");
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      setError("Name, price, and stock are required.");
      return;
    }
    setError(null);
    onSave({
      ...initialData,
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imageUrl,
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 450, background: '#fff7f0', borderRadius: 18, boxShadow: '0 6px 32px 0 rgba(241,100,30,0.08)', padding: 32, margin: '32px auto', maxWidth: 520 }}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ color: '#f1641e', fontWeight: 800, marginBottom: 8, letterSpacing: 1 }}>{initialData ? 'Edit Product' : 'Add Product'}</h2>
          <p style={{ color: '#333', marginBottom: 20, fontSize: 18, fontWeight: 500 }}>Showcase your unique item to the world!</p>
          {error && <div style={{ color: '#d32f2f', marginBottom: 16, fontWeight: 600 }}>{error}</div>}
          {imageUrl && (
            <img src={imageUrl} alt="Preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 12px 0 rgba(241,100,30,0.10)', marginBottom: 18, border: '2px solid #f1641e' }} />
          )}
          <input
            placeholder="Product Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid #f1641e',
              marginBottom: 16,
              fontSize: 16
            }}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid #f1641e33',
              marginBottom: 16,
              fontSize: 16,
              resize: 'vertical',
              minHeight: 60
            }}
          />
          <div style={{ display: 'flex', gap: 16, width: '100%', marginBottom: 16 }}>
            <input
              type="number"
              placeholder="Price ($)"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #f1641e33',
                fontSize: 16
              }}
            />
            <input
              type="number"
              placeholder="Stock"
              min="0"
              value={stock}
              onChange={e => setStock(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #f1641e33',
                fontSize: 16
              }}
            />
          </div>
          <input
            placeholder="Image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid #f1641e33',
              marginBottom: 24,
              fontSize: 16
            }}
          />
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: 18 }}>
            <button
              type="submit"
              style={{
                background: '#f1641e',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 32px',
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
                boxShadow: '0 2px 12px 0 rgba(241,100,30,0.10)',
                transition: 'background 0.2s',
              }}
            >
              {initialData ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: '#fff',
                color: '#f1641e',
                border: '2px solid #f1641e',
                borderRadius: 10,
                padding: '12px 32px',
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
                boxShadow: '0 2px 12px 0 rgba(241,100,30,0.10)',
                transition: 'background 0.2s',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
