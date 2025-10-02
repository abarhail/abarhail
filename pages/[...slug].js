// pages/[...slug].js
import { useRouter } from 'next/router';
import Quality from './quality';
import About from './about';
import SocialResponsibility from './social-responsibility';
import News from './news';
import Products from './products';

export default function SlugPage({ news, social }) {
  const { query } = useRouter();
  const slug = query.slug?.[0];

  switch (slug) {
    case 'الجودة':
      return <Quality />;
    case 'عن-آبار-حائل':
      return <About />;
    case 'المسؤولية-الاجتماعية':
      return <SocialResponsibility social={social} />;
    case 'الأخبار':
      return <News news={news} />;
    case 'المنتجات':
      return <Products />;
    default:
      return <div>Page not found</div>;
  }
}

// Helper to fetch all pages for a given endpoint
async function fetchAllPages(endpoint) {
  let allItems = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}?page=${page}`);
    const data = await res.json();

    allItems = allItems.concat(data?.data?.items ?? []);
    hasNext = data?.data?.pagination?.has_next ?? false;
    page++;
  }

  return allItems;
}

export async function getServerSideProps() {
  try {
    const [news, social] = await Promise.all([
      fetchAllPages('news'),
      fetchAllPages('social')
    ]);

    return {
      props: { news, social },
    };
  } catch (err) {
    console.error("❌ Failed to fetch data:", err);
    return { props: { news: [], social: [] } };
  }
}
