import { useNavigate } from "react-router-dom";
import { fileOperations } from "../constance/ConvertOptions";

const FileConverter = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fileOperations.map((operation, index) => (
          <div
            key={index}
            onClick={() => {
              if (!operation.menushow) {
                navigate(operation.path);
              }
            }}
            className="group cursor-pointer"
          >
            <div
              className="
                h-full rounded-xl bg-white
                shadow-md hover:shadow-xl
                transition-all duration-300
                p-8 flex flex-col items-center text-center
              "
            >
              <div
                className="
                  text-red-500 group-hover:text-red-600
                  transition-colors duration-300
                  text-4xl mb-4
                "
              >
                <operation.icon />
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">
                {operation.label}
              </h3>

              <p className="text-sm text-gray-500 leading-snug">
                {operation.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileConverter;
