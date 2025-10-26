import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../hooks/useLanguage";
import { siteConfig } from "../config/site";

const Navbar = ({ specialClass = "" }) => {
  const { currentLanguage, switchLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pages, setPages] = useState([]); // dynamic published pages

  const getNavLink = (key) => siteConfig.urls[currentLanguage][key];

  // ✅ Fetch all paginated /pages and filter published ones
  useEffect(() => {
    const fetchAllPages = async () => {
      let allItems = [];
      let page = 1;
      let hasNext = true;

      try {
        while (hasNext) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages?page=${page}`);
          if (!res.ok) {
            console.error(`❌ Failed to fetch /pages page ${page}`);
            break;
          }

          const data = await res.json();
          const items = data?.data?.items ?? [];
          allItems = allItems.concat(items);

          hasNext = data?.data?.pagination?.has_next ?? false;
          page++;
        }

        // ✅ Only keep published pages
        const publishedPages = allItems.filter((p) => p.status === "published");
        
        setPages(publishedPages);
      } catch (err) {
        console.error("❌ Failed to fetch pages:", err);
      }
    };

    fetchAllPages();
  }, []);

  return (
    <nav className={`navbar ${specialClass}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          {/* <img src="/images/logo.png" alt="Abarhail" className="logo" /> */}
        </Link>

        <ul className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <li><Link href={getNavLink("about")}>{t("navigation.about")}</Link></li>
          <li><Link href={getNavLink("quality")}>{t("navigation.quality")}</Link></li>
          <li><Link href={getNavLink("products")}>{t("navigation.products")}</Link></li>
          <li><Link href={getNavLink("socialResponsibility")}>{t("navigation.socialResponsibility")}</Link></li>
          <li><Link href={getNavLink("news")}>{t("navigation.news")}</Link></li>
          <li><Link href={getNavLink("blogs")}>{t("navigation.blogs")}</Link></li>

          {/* ✅ Dynamically added published pages */}
          {pages.map((page) => (
            <li key={page.id}>
              <Link href={`/pages/${page.id}`}>
                {page.name?.[currentLanguage] || page.name?.en || "Untitled"}
              </Link>
            </li>
          ))}
        </ul>

        <li className="lang-change">
          <button className="language-switch" onClick={switchLanguage}>
            {t("common.switchLanguage")}
          </button>
        </li>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
