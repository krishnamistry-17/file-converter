import Herosection from "./Herosection";
import ConvertTabs from "../../components/ConvertTabs";

const Home = () => {
  return (
    <div className="flex flex-col w-full h-screen ">
      <div className=" bg-gray-100 ">
        <div>
          <Herosection />
        </div>
        <div>
          <ConvertTabs />
        </div>
      </div>
    </div>
  );
};
export default Home;
