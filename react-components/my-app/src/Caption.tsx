interface CaptionProps {
  caption: string;
}

export function Caption({ caption }: CaptionProps) {
  return <h3>{caption}</h3>;
}
