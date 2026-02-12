import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
}

export const SEO = ({ title, description, url, image, type = "website" }: SEOProps) => {
  const siteTitle = "Subs 4 Unlock";
  const domain = "https://subs4unlock.com";
  const defaultImage = `${domain}/banner.webp`;
  
  const metaUrl = url ? (url.startsWith("http") ? url : `${domain}${url}`) : domain;
  const metaImage = image ? (image.startsWith("http") ? image : `${domain}${image}`) : defaultImage;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={metaUrl} />

      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={metaImage} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Subs4Unlock" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};