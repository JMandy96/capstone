import { useEffect, useState } from 'react';
import axios from 'axios';
import {useCart} from './Cart'
import './Styles/Products.css'



interface IProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
}

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [displayProducts, setDisplayProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addToCart } = useCart();
  useEffect(() => {
    axios.get('https://rlvtg.onrender.com/api/products')
      .then((response) => {
        const data = response.data;
        setProducts(data);
        setDisplayProducts(data);
        // Extract unique categories
        const uniqueCategories = Array.from(new Set((data as IProduct[]).map(p => p.category)));
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error('Error fetching data:', error, error.response);
      });
  }, []);

  useEffect(() => {
    if(selectedCategory) {
      setDisplayProducts(products.filter(product => product.category === selectedCategory));
    } else {
      setDisplayProducts(products);
    }
  }, [selectedCategory, products]);

  return (
    <>
      <div className='sidebar'>
        <h1>Filters:</h1>
        <ul>
          <li onClick={() => setSelectedCategory(null)}>All</li>
          {categories.map((category) => (
            <li key={category} onClick={() => setSelectedCategory(category)}>
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div className='products'>
        <h2>Products</h2>
        <div className="product-list" >
        {displayProducts.map((product) => (
  <div key={product.id} className="card small-card">
    <img src='{product.image_url}' alt={product.name} />
    <div className="card-body">
      <h3 className="card-title">{product.name}</h3>
      <div className="item-info">
        <p className="card-text">Price: ${product.price}</p>
        <p className="card-text">Category: {product.category}</p>
        <p className="card-text">Description: {product.description}</p>
      </div>
      <div className='button'>
      <button 
        className="add-to-cart" 
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
    </div>
  </div>
))}
        </div>
      </div>
    </>
  );
};

export default Products;