import { useState, memo } from "react";
import Navbar from "./Navbar";

const Tabs = ({
  tabs,
  clients,
  socketRef,
  editorRef,
  messages,
  codeBoardBotResults,
  setCodeBoardBotResults,
  isLoadingImg,
  setIsLoadingImg,
  isLoadingContent,
  setIsLoadingContent,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-screen h-screen">
      <TabList tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex w-full h-full">
        <Navbar
          clients={clients}
          socketRef={socketRef}
          editorRef={editorRef}
          messages={messages}
          activeTab={activeTab}
          codeBoardBotResults={codeBoardBotResults}
          setCodeBoardBotResults={setCodeBoardBotResults}
          isLoadingImg={isLoadingImg}
          setIsLoadingImg={setIsLoadingImg}
          isLoadingContent={isLoadingContent}
          setIsLoadingContent={setIsLoadingContent}
        />

        {tabs.map((tab, index) => (
          <TabPanel key={index} active={activeTab === index}>
            {tab.content}
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

const TabList = memo(({ tabs, activeTab, setActiveTab }) => (
  <div className="fixed top-0 z-10 flex justify-center w-screen gap-10 bg-tabbar">
    {tabs.map((tab, index) => (
      <button
        key={index}
        className={`h-12 transition-colors duration-500 ${
          activeTab === index
            ? "border-b-2 border-primary text-primary font-semibold"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab(index)}
        aria-selected={activeTab === index}
        role="tab"
        id={`tab-${index}`}
        aria-controls={`panel-${index}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
));

const TabPanel = ({ children, active }) => {
  return (
    <div
      className="mt-14 py-2 w-[96.3vw] h-[95vh] md:h-[92vh]  md:left-14"
      role="tabpanel"
      hidden={!active}
      id={`panel-${children}`}
    >
      {active && children}
    </div>
  );
};

export default Tabs;
