import Image from 'next/image';

interface AvatarProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function Avatar({
  src,
  alt,
  width = '32',
  height = '32',
  className,
}: AvatarProps) {
  return (
    <Image
      className={className}
      src={src}
      width={width}
      height={height}
      alt={alt}
    />
  );
}
