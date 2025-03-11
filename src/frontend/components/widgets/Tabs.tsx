import { ReactElement, useEffect, useMemo, useState } from "react";
import { TabProps } from "./Tab";
import "../../styles/tabs.css";

interface TabsProps {
  children: ReactElement<TabProps>[];
  onTabChanged: (index: number) => void;
}

export const Tabs = ({ children, onTabChanged }: TabsProps) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const selectedTab = useMemo(() => {
    return children[selectedTabIndex];
  }, [selectedTabIndex]);

  const tabButtonClassName = (tab: ReactElement<TabProps>) =>
    `tab-label ${selectedTab === tab ? "active" : ""}`;

  const hadAtLeastOneTab = children.length > 0;
  const hasMoreThanOneTab = children.length > 1;

  useEffect(() => {
    onTabChanged(selectedTabIndex);
  }, [selectedTabIndex]);

  return hadAtLeastOneTab
    ? (
      <div className="w-full">
        {hasMoreThanOneTab &&
          (
            <div className="flex flex-row gap-x-2 p-2">
              {children.map((tab, i) => (
                <button
                  key={`tab-label-${tab.props.label}`}
                  type="button"
                  className={tabButtonClassName(tab)}
                  onClick={() => setSelectedTabIndex(i)}
                >
                  {tab.props.label}
                </button>
              ))}
            </div>
          )}
        <div className="tab-content">
          {selectedTab}
        </div>
      </div>
    )
    : null;
};
