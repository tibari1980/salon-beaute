import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, url, image, type = 'website' }) {
    const siteTitle = 'JL Beauty | Salon de Beauté & Coiffure';
    const finalTitle = title ? `${title} | JL Beauty` : siteTitle;
    const metaDescription = description || "JL Beauty - Votre salon de beauté et coiffure de luxe. Réservez en ligne vos soins, coiffure, manucure et bien plus.";
    const metaImage = image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200&h=630"; // Using unsplash for generic fallback
    const metaUrl = url ? `https://jlbeauty.ma${url}` : "https://jlbeauty.ma";

    const schema = {
        "@context": "https://schema.org",
        "@type": "BeautySalon",
        "name": "JL Beauty",
        "image": metaImage,
        "url": metaUrl,
        "telephone": "+212000000000", // Placeholder
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Adresse du Salon", // Update with real address if known
            "addressLocality": "Casablanca",
            "postalCode": "20000",
            "addressCountry": "MA"
        },
        "priceRange": "$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "20:00"
            }
        ]
    };

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{finalTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={metaUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
