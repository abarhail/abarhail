// pages/[...slug].js
import Quality from './quality';
import About from './about';
import SocialResponsibility from './social-responsibility';
import News from './news';
import Products from './products';

// Helper to fetch all pages for a given endpoint
async function fetchAllPages(endpoint) {
  let allItems = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const res = await fetch(`http://localhost/abarhail-api/api/v1/${endpoint}?page=${page}`);
    const data = await res.json();

    allItems = allItems.concat(data?.data?.items ?? []);
    hasNext = data?.data?.pagination?.has_next ?? false;
    page++;
  }

  return allItems;
}

export default function SlugPage({ news, social, slug }) {
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

export async function getStaticProps({ params }) {
  const slug = params.slug?.[0] ?? null;

  try {
    const [news, social] = await Promise.all([
      fetchAllPages('news'),
      fetchAllPages('social')
    ]);

    return {
      props: {
        news,
        social,
        slug
      },
      // Revalidate the page every 60 seconds
      revalidate: 3600,
    };
  } catch (err) {
    console.error("❌ Failed to fetch data:", err);
    return {
      props: {
        news: [],
        social: [],
        slug
      },
      revalidate: 60,
    };
  }
}

export async function getStaticPaths() {
  // Pre-render known slugs at build time
  const paths = [
    { params: { slug: ['الجودة'] } },
    { params: { slug: ['عن-آبار-حائل'] } },
    { params: { slug: ['المسؤولية-الاجتماعية'] } },
    { params: { slug: ['الأخبار'] } },
    { params: { slug: ['المنتجات'] } },
  ];

  return { paths, fallback: 'blocking' };
}
