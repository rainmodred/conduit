import Image from 'next/image';
import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  className?: string;
}

const FALLBACK_IMAGE = 'https://api.realworld.io/images/smiley-cyrus.jpeg';

function parseSrc(src: string) {
  try {
    new URL(src);
    return src;
  } catch (error) {
    return FALLBACK_IMAGE;
  }
}

export default function Avatar({
  src,
  alt,
  width = '32',
  height = '32',
  className,
}: AvatarProps) {
  const [imageSrc, setImageSrc] = useState(parseSrc(src));

  return (
    <Image
      className={className}
      src={imageSrc}
      width={width}
      height={height}
      alt={alt}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  );
}
