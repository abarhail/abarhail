// components/DetailPage.js
import { useRouter } from 'next/router';
import Layout from './Layout';
import { useLanguage } from '../hooks/useLanguage';
import he from 'he';
import dayjs from 'dayjs';

function cleanText(text) {
  return text ? he.decode(text) : '';
}

export default function DetailPage({ item, pageKey }) {
  const router = useRouter();
  const { currentLanguage } = useLanguage();

  if (!item) {
    return (
      <Layout pageKey={pageKey}>
        <div className="detailed-page">
          <div className="detail-container">
            <div className="not-found">
              {currentLanguage === 'ar' ? 'المحتوى غير موجود' : 'Content not found'}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const title = cleanText(item.title[currentLanguage]);
  const contentText = cleanText(item.content[currentLanguage]);
  const images = item.images || [];
  return (
    <Layout pageKey={pageKey}>
      <div className="detailed-page" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="detail-container page-container">
          <div className="detail-content">

            {/* First Image */}
            {images.length > 0 && (
              <div className="detail-main-image">
                <img
                  src={images[0]}
                  alt={title}
                  className="main-image"
                  loading="lazy"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="detail-title">{title}</h1>

            {/* Content */}
            <div className="detail-text">
              {contentText.split('\n').map((paragraph, idx) =>
                paragraph.trim() ? <p key={idx} className="content-paragraph">{paragraph}</p> : null
              )}
            </div>

            {/* Remaining Images Gallery */}
            {images.length > 1 && (
              <div className="detail-images">
                <h2 className="gallery-title">
                  {currentLanguage === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
                </h2>
                <div className="gallery-grid">
                  {images.slice(1).map((img, idx) => (
                    <div key={idx} className="gallery-item">
                      <img
                        src={img}
                        alt={`${title} - ${idx + 2}`}
                        className="gallery-image"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button */}
            <button
              className="back-button"
              onClick={() => router.back()}
              aria-label={currentLanguage === 'ar' ? 'العودة' : 'Go back'}
            >
              <span className="back-arrow">{currentLanguage === 'ar' ? '←' : '→'}</span>
              {currentLanguage === 'ar' ? 'العودة' : 'Back'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
