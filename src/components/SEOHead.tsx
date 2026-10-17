import { Helmet } from 'react-helmet-async';
import { profile, skillGroups } from '@/data/portfolio';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead = ({ 
  title = "Vasanthakumar Rajendran | React & Shopify Developer",
  description = "Front-End Developer building React interfaces and Shopify storefronts with Liquid, responsive UI, API integration, testing, and technical SEO.",
  image = profile.siteUrl + "assets/profile-hero.jpg",
  url = profile.siteUrl,
  type = "profile"
}: SEOHeadProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={profile.name} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Portfolio portrait" />
      <meta property="og:site_name" content={`${profile.name} Portfolio`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Portfolio portrait" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": url + "#profile",
          "mainEntity": {
          "@type": "Person",
          "@id": url + "#person",
          "name": profile.name,
          "jobTitle": "Web Developer & E-commerce Executive",
          "description": description,
          "url": url,
          "image": image,
          "email": profile.email,
          "sameAs": [
            profile.linkedin,
            profile.github
          ],
          "knowsAbout": skillGroups.flatMap(group => group.items)
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
