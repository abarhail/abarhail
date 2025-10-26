import ListPage from '../../components/ListPage';

// Helper to fetch all pages for an endpoint
async function fetchAllPages(endpoint) {
  let allItems = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}?page=${page}`);

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

export default function Blogs({ blogs = [] }) {
  return (
    <ListPage
      pageKey="blogs"
      data={blogs}
      navBasePath="blogs"
    />
  );
}

export async function getStaticProps() {
  try {
    const blogs = await fetchAllPages('blogs');

    return {
      props: { blogs },
      revalidate: 3600, // revalidate every hour
    };
  } catch (err) {
    console.error("❌ Failed to fetch blogs:", err);
    return { props: { blogs: [] }, revalidate: 3600 };
  }
}
