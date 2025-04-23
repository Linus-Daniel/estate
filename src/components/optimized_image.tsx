import Image from 'next/image';

const OptimizedImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="/images/placeholder.jpg"
      />
    </div>
  );
};

export default OptimizedImage;