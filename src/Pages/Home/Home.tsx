import Herosection from "./Herosection";
import ConvertTabs from "../../components/ConvertTabs";

const Home = () => {
  return (
    <div className="w-full bg-linear-to-b from-gray-50 to-white">
      <section>
        <Herosection />
      </section>

      <section className=" pt-4 pb-24">
        <ConvertTabs />
      </section>
    </div>
  );
};
export default Home;
