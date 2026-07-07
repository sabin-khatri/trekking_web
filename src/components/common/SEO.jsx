import React from 'react';
import { Helmet } from 'react-helmet-async';
import { COMPANY } from '../../config/company';
import { IMAGES } from '../../config/images';

export default function SEO({ title, description, type = 'website', image = IMAGES.og }) {
  const siteName = COMPANY.name;
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const defaultDescription = COMPANY.description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
