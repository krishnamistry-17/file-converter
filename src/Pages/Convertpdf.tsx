import { useNavigate } from "react-router-dom";
import { convertOptions } from "../constance/ConvertOptions";

const ConvertPdf = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-col">
        {convertOptions.map((section: any, idx: number) => (
          <div key={idx} className=" p-4">
            <h3 className="font-semibold mb-2">{section.title}</h3>
            <ul className="space-y-1 items-center justify-center">
              {section.options.map((item: any, i: number) => (
                <li key={i} className="text-center">
                  <button
                    onClick={() => {
                      navigate(item.path);
                      close();
                    }}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2 justify-start">
                      <item.icon className=" text-red-500 text-lg" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConvertPdf;
