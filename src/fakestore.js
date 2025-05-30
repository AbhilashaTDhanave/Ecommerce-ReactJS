import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FakeStore() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
        setLoading(false);
      });

    axios.get('https://fakestoreapi.com/products/categories')
      .then(res => setCategories(res.data));
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterProducts(search, category);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterProducts(value, selectedCategory);
  };

  const filterProducts = (searchText, category) => {
    let temp = [...products];

    if (category !== 'all') {
      temp = temp.filter(p => p.category === category);
    }

    if (searchText.trim()) {
      temp = temp.filter(p => p.title.toLowerCase().includes(searchText.toLowerCase()));
    }

    setFiltered(temp);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-3">
        <a className="navbar-brand fw-bold" href="/">FakeStore</a>
        <div className="collapse navbar-collapse justify-content-end">
          <form className="d-flex align-items-center flex-wrap gap-2">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search products"
              value={search}
              onChange={handleSearchChange}
              style={{ minWidth: '150px' }}
            />
            <button
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleCategoryClick('all')}
              type="button"
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleCategoryClick(cat)}
                type="button"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </form>
        </div>
      </nav>

      {/* Product Grid */}
      <div className="container mt-3">
        {loading ? (
          <div className="text-center my-5">Loading products...</div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {filtered.map(product => (
              <div className="col" key={product.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {product.title.length > 25 ? product.title.slice(0, 25) + '...' : product.title}
                    </h5>
                    <p className="card-text">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="card-footer text-center">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <>
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{
              display: 'block',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedProduct.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedProduct(null)}
                  ></button>
                </div>
                <div className="modal-body d-flex flex-column flex-md-row align-items-center gap-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    style={{ maxWidth: '200px', maxHeight: '250px', objectFit: 'contain' }}
                  />
                  <div>
                    <p>{selectedProduct.description}</p>
                    <p className="text-muted">Category: {selectedProduct.category}</p>
                    <h5 className="text-primary">${selectedProduct.price.toFixed(2)}</h5>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default FakeStore;
