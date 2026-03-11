type BannerButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export function BannerButton({ onClick, children }: BannerButtonProps) {
  return (
    <button
      className="banner-button text-slate-900 font-bold cursor-pointer border-2 border-slate-900 rounded-md px-8 py-4"
      onClick={onClick}>
      {children}
    </button>
  );
}
