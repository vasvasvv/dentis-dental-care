import JsonLdScript from "@/components/SEO/JsonLdScript";
import { SITE_URL } from "@/utils/seo";

type ReviewSchemaItem = {
  author: string;
  rating: number;
  text: string;
};

type ReviewSchemaProps = {
  id: string;
  reviews: ReviewSchemaItem[];
};

export default function ReviewSchema({ id, reviews }: ReviewSchemaProps) {
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;

  return (
    <JsonLdScript
      id={id}
      data={{
        "@context": "https://schema.org",
        "@type": "Dentist",
        name: "Dentis",
        url: SITE_URL,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: Number(averageRating.toFixed(1)),
          reviewCount,
        },
        review: reviews.map((review) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: review.author,
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
          },
          reviewBody: review.text,
        })),
      }}
    />
  );
}
