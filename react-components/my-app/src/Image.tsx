interface ImageProps {
  imageUrl: string;
}

export function Image({ imageUrl }: ImageProps) {
  return (
    <div className="flex justify-center">
      <div className="img-wrapper">
        <img src={imageUrl} alt="Image" />
      </div>
    </div>
  );
}
