import { useEffect, useReducer, useState } from "react";

import "./style.css";

function IndexPopup() {
  // const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([])
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);

  useEffect(() => {
    const setup = async () => {
      const groups = await chrome.tabGroups.query({});
      if (groups) {
        setTabGroups(groups);
      }
    };

    setup();
  }, []);

  const handleTabGroup = async () => {
    const domains = new Map<string, chrome.tabs.Tab[]>();
    const tabs = await chrome.tabs.query({ currentWindow: true });

    // Get the base domain of each tab and put into the domains Set
    tabs.forEach((tab) => {
      const url = new URL(tab.url);

      if (domains.has(url.hostname)) {
        domains.get(url.hostname).push(tab);
      } else {
        domains.set(url.hostname, [tab]);
      }
    });

    for (const [domain, tabs] of domains) {
      const group = await chrome.tabs.group({
        tabIds: tabs.map((tab) => tab.id)
      });
      await chrome.tabGroups.update(group, { title: domain });
    }
  };

  const handleUngroupTabs = async () => {
    const currentGroupedTabs = await chrome.tabs.query({ currentWindow: true });
    console.log(currentGroupedTabs);
  };

  return (
    <div className="w-52">
      <div>
        <ul>
          {tabGroups &&
            tabGroups.map((tabGrp) => <li key={tabGrp.id}>{tabGrp.title}</li>)}
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          className="rounded bg-cyan-500 text-white hover:bg-cyan-700 p-2 m-2"
          onClick={handleTabGroup}>
          Group Tabs
        </button>
        <button
          className="rounded bg-cyan-500 text-white hover:bg-cyan-700 p-2 m-2"
          onClick={handleUngroupTabs}>
          Ungroup Tabs
        </button>
      </div>
    </div>
  );
}

export default IndexPopup;
