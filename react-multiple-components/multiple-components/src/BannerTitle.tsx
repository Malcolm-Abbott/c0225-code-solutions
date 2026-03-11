type BannerTitleProps = {
  title: string;
};

export function BannerTitle({ title }: BannerTitleProps) {
  return (
    <div className="banner-item">
      <h1 className="text-4xl font-bold text-center">{title}</h1>
    </div>
  );
}
