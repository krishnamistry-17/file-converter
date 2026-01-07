import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import TableView from "./TableView";
import UploadData from "./UploadData";
import FileConverter from "./FileConverter";
import { useState } from "react";

const ConvertTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Convert PDF", "Export PDF", "Import PDF"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
        <div className="flex justify-center">
          <TabList
            className="flex overflow-x-auto no-scrollbar bg-gray-100 rounded-full p-1 gap-1"
            style={{ scrollbarWidth: "none" }}
          >
            {tabs.map((label, index) => (
              <Tab
                key={index}
                className={`
                  cursor-pointer select-none
                  px-6 py-2 text-sm font-semibold rounded-full
                  transition-all duration-300
                  focus:outline-none
                  ${
                    activeTab === index
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }
                `}
              >
                {label}
              </Tab>
            ))}
          </TabList>
        </div>

        {/* Content */}
        <div className="mt-8">
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
