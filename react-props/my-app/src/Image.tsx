import './Image.css';

type ImageProps = {
  src: string;
  alt: string;
};

export function Image({ src, alt }: ImageProps) {
  return (
    <div className="d-flex justify-content-center">
      <div className="width-50 ">
        <img className="image-fill" src={src} alt={alt} />
      </div>
    </div>
  );
}
