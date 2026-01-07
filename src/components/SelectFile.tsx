interface SelectFileProps {
  heading: string;
  description: string;
}

const SelectFile = ({ heading, description }: SelectFileProps) => {
  return (
    <div>
      <div className="flex flex-col items-center gap-2 py-8">
        <h3 className="text-3xl font-bold">{heading}</h3>
        <p className="text-lg text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default SelectFile;
