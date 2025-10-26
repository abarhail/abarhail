import Quality from './quality';
import About from './about';
import SocialResponsibility from './social-responsibility';
import News from './news';
import Products from './products';
import Blogs from './blogs';

async function fetchAllPages(endpoint) {
  let allItems = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}?page=${page}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint} page ${page}`);
    const data = await res.json();
    allItems = allItems.concat(data?.data?.items ?? []);
    hasNext = data?.data?.pagination?.has_next ?? false;
    page++;
  }

  return allItems;
}

export default function SlugPage({ news, social, products, blogs, slug }) {
  switch (slug) {
    case 'الجودة': return <Quality />;
    case 'عن-آبار-حائل': return <About />;
    case 'المسؤولية-الاجتماعية': return <SocialResponsibility social={social} />;
    case 'الأخبار': return <News news={news} />;
    case 'المقالات': return <Blogs blogs={blogs} />;
    case 'المنتجات': return <Products products={products} />;
    default: return <div>Page not found</div>;
  }
}

export async function getStaticProps({ params }) {
  const slug = params.slug?.[0] ?? null;

  try {
    const [news, social, products, blogs] = await Promise.all([
      fetchAllPages('news'),
      fetchAllPages('social'),
      fetchAllPages('products'),
      fetchAllPages('blogs')
    ]);

    return {
      props: { news, social, products, blogs, slug },
      revalidate: 3600,
    };
  } catch (err) {
    console.error("❌ Failed to fetch data:", err);
    return {
      props: { news: [], social: [], products: [], blogs: [], slug },
      revalidate: 3600,
    };
  }
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: ['الجودة'] } },
      { params: { slug: ['عن-آبار-حائل'] } },
      { params: { slug: ['المسؤولية-الاجتماعية'] } },
      { params: { slug: ['الأخبار'] } },
      { params: { slug: ['المقالات'] } },
      { params: { slug: ['المنتجات'] } },
    ],
    fallback: 'blocking',
  };
}
