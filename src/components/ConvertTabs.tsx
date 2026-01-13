import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import TableView from "./TableView";
import UploadData from "./UploadData";
import FileConverter from "./FileConverter";
import { useState } from "react";

const ConvertTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Convert PDF", "Export PDF", "Import PDF"];

  return (
    <div className="max-w-7xl mx-auto px-4 ">
      <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
        <div className="flex justify-center mb-10">
          <TabList
            className="sm:flex sm:flex-row flex-col bg-white sm:w-auto w-full  
            sm:rounded-full shadow-md sm:p-2 p-4 gap-2"
            style={{ scrollbarWidth: "none" }}
          >
            {tabs.map((tab: any, index: number) => {
              return (
                <Tab
                  key={index}
                  className={`
              cursor-pointer px-6 py-2 text-sm font-semibold rounded-full text-center
              transition-all duration-300 outline-none
              ${
                activeTab === index
                  ? "bg-linear-to-r from-red-500 to-red-400 text-white shadow"
                  : "text-gray-500 hover:text-gray-900"
              }
            `}
                >
                  {tab}
                </Tab>
              );
            })}
          </TabList>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <TabPanel>
            <FileConverter />
          </TabPanel>

          <TabPanel>
            <TableView />
          </TabPanel>

          <TabPanel>
            <UploadData />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

export default ConvertTabs;
