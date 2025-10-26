// pages/news/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DetailPage from '../../components/DetailPage';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function BlogsDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlogsItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch blogs item');
        const data = await res.json();
        setItem(data.data); // <-- pass the "data" object from API response
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsItem();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!item) return <p>blogs item not found.</p>;

  return <DetailPage item={item} pageKey="blogs" />;
}
