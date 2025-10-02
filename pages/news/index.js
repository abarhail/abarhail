import ListPage from '../../components/ListPage';

// Helper to fetch all pages for an endpoint
async function fetchAllPages(endpoint) {
  let allItems = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const res = await fetch(`http://localhost/abarhail-api/api/v1/${endpoint}?page=${page}`);
    if (!res.ok) {
      console.error(`Failed to fetch page ${page} of ${endpoint}`);
      break;
    }
    const data = await res.json();

    allItems = allItems.concat(data?.data?.items ?? []);
    hasNext = data?.data?.pagination?.has_next ?? false;
    page++;
  }

  return allItems;
}

export default function News({ news = [] }) {
  return (
    <ListPage
      pageKey="news"
      data={news}
      navBasePath="news"
    />
  );
}

export async function getStaticProps() {
  try {
    const news = await fetchAllPages('news');

    return {
      props: { news },
      revalidate: 3600, // revalidate every hour
    };
  } catch (err) {
    console.error("❌ Failed to fetch news:", err);
    return { props: { news: [] }, revalidate: 3600 };
  }
}
