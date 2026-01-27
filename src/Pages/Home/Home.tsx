import Herosection from "./Herosection";
import ConvertTabs from "../../components/ConvertTabs";
import Detail from "./Detail/Detail";
import ConversionFlow from "./Detail/ConversionFlow";
// import { Editor } from "@test-my/text-editor";
// import "@test-my/text-editor/dist/style.css";

const Home = () => {
  return (
    <div className="w-full bg-linear-to-b from-gray-50 to-white">
      {/* <div className="my-4">
        <Editor defaultTheme="light" />
      </div> */}
      <section>
        <Herosection />
      </section>

      <section className=" pt-4 pb-24">
        <ConvertTabs />
      </section>

      <section className=" pt-4 md:pb-20 pb-10">
        <ConversionFlow />
      </section>

      <section className=" pt-4 pb-24">
        <Detail />
      </section>
    </div>
  );
};
export default Home;
