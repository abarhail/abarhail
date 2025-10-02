import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../hooks/useLanguage';
import { content } from '../data/content';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Products() {
  const { currentLanguage } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageContent = content.pages.products[currentLanguage];
  if (!pageContent) 
    return <Layout pageKey="products"><div>Page not found</div></Layout>;

  useEffect(() => {
    const fetchAllPages = async () => {
      try {
        setLoading(true);
        let allItems = [];
        let page = 1;
        let hasNext = true;

        while (hasNext) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}`);
          if (!response.ok) throw new Error(`Failed to fetch page ${page}`);
          const data = await response.json();

          allItems = allItems.concat(data?.data?.items ?? []);
          hasNext = data?.data?.pagination?.has_next ?? false;
          page++;
        }

        setProducts(allItems);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPages();
  }, []);

  return (
    <Layout pageKey="products">
      <h2 className='products-page-title'>{pageContent.title}</h2>

      {loading && <LoadingSpinner />}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div className="products-grid-container">
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
