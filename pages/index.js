import Layout from '../components/Layout';
import HeroCarousel from '../components/HeroCarousel';
import { useLanguage } from '../hooks/useLanguage';
import { content } from '../data/content';
import ProductSlide from '../components/ProductSlide';
import NewSlider from '../components/NewsSlider';

export default function Home({ products, news }) {
  const { currentLanguage } = useLanguage();
  const heroSlides = content.homepage.hero.slides || [];

  return (
    <Layout pageKey="home" navbarClass="home-navbar">
      <section id="home">
        <HeroCarousel
          slides={heroSlides}
          currentLanguage={currentLanguage}
          isRTL={currentLanguage === 'ar'}
        />
      </section>
      <ProductSlide products={products} />
      <NewSlider news={news} />
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const [productsRes, newsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`)
    ]);

    const [products, news] = await Promise.all([
      productsRes.json(),
      newsRes.json()
    ]);

    return {
      props: { products, news },
      revalidate: 3600, // rebuild every 1 hour
    };
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return { props: { products: [], news: [] }, revalidate: 3600 };
  }
}
