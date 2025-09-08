import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead = ({ 
  title = "Vasantha Kumar - Frontend Developer Portfolio",
  description = "Frontend Developer specializing in React, Material UI, and modern web technologies. View my projects, experience, and get in touch for collaboration opportunities.",
  image = "/profile-hero.jpg",
  url = "https://vasanthakumar-portfolio.com",
  type = "website"
}: SEOHeadProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content="Frontend Developer, React Developer, Material UI, Web Development, JavaScript, TypeScript, Portfolio, Vasantha Kumar" />
      <meta name="author" content="Vasantha Kumar" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Vasantha Kumar Portfolio" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Vasantha Kumar",
          "jobTitle": "Frontend Developer",
          "description": description,
          "url": url,
          "image": image,
          "sameAs": [
            "https://www.linkedin.com/in/vasanthakumar-jpg/",
            "https://github.com/vasanthakumar-jpg"
          ],
          "knowsAbout": ["React", "JavaScript", "TypeScript", "Material UI", "Frontend Development", "Web Development"],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Chennai",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "India"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;