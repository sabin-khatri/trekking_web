import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, type = 'website', image = '/src/assets/img/everest.jpg' }) {
  const siteName = "Himalayan Treks & Adventures";
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const defaultDescription = "Experience the breathtaking beauty of Nepal with our expertly guided trekking packages to Everest, Annapurna, and beyond.";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* OpenGraph tags for Facebook/LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
