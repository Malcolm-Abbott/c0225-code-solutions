type DescriptionProps = {
  description: string;
};

export function Description({ description }: DescriptionProps) {
  return <p>{description}</p>;
}
