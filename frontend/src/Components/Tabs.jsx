import { useState, memo } from "react";
import Sidebar from "./Sidebar";

import { Tabbar } from "./External Components/Tabbar/Tabbar";

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
  pistonSupportedRuntimes,
  isSolo,
  setOpenCollaborationPopup,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative w-screen h-screen bg-[#1e1e1e] flex flex-col">
      <Tabbar
        navItems={tabs}
        activeTab={activeTab}
        onClick={(idx) => setActiveTab(idx)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          className="w-[50px] h-full"
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
          pistonSupportedRuntimes={pistonSupportedRuntimes}
          isSolo={isSolo}
          setOpenCollaborationPopup={setOpenCollaborationPopup}
        />

        <div className="flex-1 overflow-auto">
          {tabs.map((tab, index) => (
            <TabPanel key={index} active={activeTab === index}>
              {tab.content}
            </TabPanel>
          ))}
        </div>
      </div>
    </div>
  );
};

const TabPanel = ({ children, active }) => {
  return (
    <div
      role="tabpanel"
      hidden={!active}
      id={`panel-${children}`}
      className={`h-full overflow-y-auto ${active ? "block" : "hidden"}`} // Apply necessary classes for height and overflow
    >
      {active && children}
    </div>
  );
};

export default Tabs;
