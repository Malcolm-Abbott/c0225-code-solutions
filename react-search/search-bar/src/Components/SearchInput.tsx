type SearchInputProps = {
  setValue: (value: string) => void;
};

export function SearchInput({ setValue }: SearchInputProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        className="p-2 rounded-md shadow-md bg-white min-w-96 mb-6 focus:outline-none"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
