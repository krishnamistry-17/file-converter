import { useNavigate } from "react-router-dom";
import { convertOptions } from "../constance/ConvertOptions";

const Dropdown = ({ close }: { close: () => void }) => {
  const navigate = useNavigate();

  return (
    <div
      className="absolute top-12 lg:left-0 left-1/2 -translate-x-1/2 mt-2 p-5 w-[500px] transition-all duration-300
     bg-white shadow-lg rounded-md text-sm z-50"
    >
      <div className="flex gap-8">
        {convertOptions.map((section: any, idx: number) => (
          <div key={idx}>
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
                      <item.icon className=" text-blue-500 text-lg" />
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

export default Dropdown;
