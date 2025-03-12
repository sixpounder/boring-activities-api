import { useCallback, useMemo, useState } from "react";
import { Highlight } from "./Highlight";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";
import CopyToClipboard from "./CopyToClipboard";
import { Pill, Tint } from "./Pill";
import { is2xx, is4xx } from "../../comms";
import { isUndefined } from "lodash-es";

interface ResponseProps<T> {
  statusCode: number;
  data: T;
  headers: Headers;
  className: string;
}

export const Response = <T,>(
  { statusCode, data, headers, className }: Partial<ResponseProps<T>>,
) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const onTabChanged = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

  const formattedData = useMemo(() => {
    return data ? JSON.stringify(data, null, 2) : null;
  }, [data]);

  const formattedHeaders = useMemo(() => {
    if (!headers) {
      return null;
    }

    const plainHeaders: Record<string, string> = {};
    for (const header of headers.entries()) {
      plainHeaders[header[0]] = header[1];
    }

    return JSON.stringify(plainHeaders, null, 2);
  }, [headers]);

  const exportText = () => {
    switch (selectedTabIndex) {
      case 0:
      default:
        return formattedData;
      case 1:
        return formattedHeaders;
    }
  };

  const statusCodeTint: Tint = useMemo(() => {
    if (isUndefined(statusCode)) {
      return "red";
    } else if (is2xx(statusCode)) {
      return "green";
    } else if (is4xx(statusCode)) {
      return "orange";
    } else {
      return "red";
    }
  }, [statusCode]);

  return (
    <div className={`response relative w-full ${className ?? ""}`}>
      <div className="toolbox absolute z-10 top-1 right-1 flex flex-row justify-start items-center gap-x-2">
        <Pill className="text-sm px-2 py-1" tint={statusCodeTint}>
          {statusCode ?? "???"}
        </Pill>
        <CopyToClipboard
          content={exportText() ?? ""}
          className="dark:text-slate-300 dark:hover:text-white text-gray-500 hover:text-gray-950 text-opacity-90 transition-colors"
        >
        </CopyToClipboard>
      </div>
      <Tabs onTabChanged={(index) => onTabChanged(index)}>
        <Tab label="Body">
          <Highlight text={formattedData ?? ""}>
          </Highlight>
        </Tab>
        <Tab label="Headers">
          <Highlight text={formattedHeaders ?? ""}>
          </Highlight>
        </Tab>
      </Tabs>
    </div>
  );
};
