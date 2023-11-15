import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: File;
}

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: undefined
  });

  useEffect(() => {
    axios.get('https://rlvtg.onrender.com/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products', error));
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: name === 'price' ? parseFloat(value) : value });
  };

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    console.log(newProduct);
    axios.post('https://rlvtg.onrender.com/api/products', newProduct)
    .then(response => {
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        image_url: undefined
      });
    })
    .catch(error => console.error('Error adding product', error));  
  };

  
  const handleDeleteProduct = (productId: number) => {
    axios.delete(`https://rlvtg.onrender.com/api/products/${productId}`)
    .then(() => {
      setProducts(products.filter(product => product.id !== productId));
    })
    .catch(error => console.error('Error deleting product', error));
  
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <h2>Add Product</h2>
        <form onSubmit={handleAddProduct}>
          <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleInputChange} />
          <input type="text" name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} />
          <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} />
          <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} />
          <input type="file" name="image_url" onChange={handleInputChange} />
          <button type="submit">Add Product</button>
        </form>
      </div>
      <div>
        <h2>Product List</h2>
        {products.map(product => (
          <div key={product.id}>
            <span>{product.name}</span>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
