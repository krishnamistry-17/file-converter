import { useNavigate } from "react-router-dom";
import { fileOperations } from "../constance/ConvertOptions";

const FileConverter = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        File Conversion Tools
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fileOperations.map((operation, index) => (
          <button
            key={index}
            onClick={() => !operation.menushow && navigate(operation.path)}
            aria-label={operation.label}
            className="
              text-left
              bg-white border border-gray-100
              rounded-xl p-8
              shadow-sm hover:shadow-xl
              transform transition-all duration-300
              hover:-translate-y-1 hover:scale-[1.02]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
            "
          >
            <div className="flex flex-col items-center text-center h-full hover:scale-110">
              <div
                className="
                  text-red-500 text-5xl mb-4
                  transition-transform duration-300"
              >
                <operation.icon />
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {operation.label}
              </h3>

              <p className="text-sm text-gray-500 mb-4 leading-snug">
                {operation.description}
              </p>

              <span className="mt-auto text-sm font-medium text-red-500">
                Convert now →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileConverter;
