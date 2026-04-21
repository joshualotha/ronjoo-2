import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  canonicalUrl?: string;
  schema?: string; // Stringified JSON-LD schema
}

export default function SEO({
  title,
  description,
  name = 'Ronjoo Safaris',
  type = 'website',
  image = 'https://ronjoosafaris.com/assets/images/og-image.jpg', // Placeholder for a default premium OG image
  url = 'https://ronjoosafaris.com',
  canonicalUrl,
  schema,
}: SEOProps) {
  const currentUrl = canonicalUrl || url;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {currentUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {schema}
        </script>
      )}
    </Helmet>
  );
}
