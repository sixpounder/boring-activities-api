import {
  ChangeEvent,
  lazy,
  PropsWithChildren,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Pill, Tint } from "./widgets/Pill";
import { ulid } from "ulid";
import { isNull, uniqBy } from "lodash-es";
import { useQuery } from "@tanstack/react-query";
import { VariableLike, VariableType } from "./variables";
import { EndpointForm } from "./widgets/EndpointForm";
import { HttpVerb, is2xx, is4xx } from "../comms";

interface ApiEndpointProps {
  href: string;
  verb: HttpVerb;
  expanded?: boolean;
  description?: string;
  queryParams?: VariableLike[];
}

const pathVariableRegex = /\{([^\}\{]+)\}/gi;

const Stylish404 = lazy(() => import("./widgets/Stylish404"));
const Highlight = lazy(() =>
  import("./widgets/Highlight").then((module) => ({
    default: module.Highlight,
  }))
);

export const ApiEndpoint = (
  { href, verb, expanded = false, description = "", queryParams = [] }:
    PropsWithChildren<ApiEndpointProps>,
) => {
  const componentId: Readonly<string> = useMemo(ulid, []);

  function tintFor(verb: HttpVerb): Tint {
    switch (verb) {
      case "GET":
        return "blue";
      case "POST":
        return "green";
      case "PUT":
        return "purple";
      case "PATCH":
        return "orange";
      case "DELETE":
        return "red";
    }
  }

  const [isExpanded, setExpanded] = useState(expanded);
  const [firstExpansion, setFirstExpansion] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);

  const [variables, setVariables] = useState<
    VariableLike[]
  >([]);

  const urlNode: JSX.Element[] = useMemo(() =>
    href.split("/").map((text) => {
      const variable = pathVariableRegex.test(text);
      let matches: RegExpMatchArray;
      if (variable) {
        matches = text.match(pathVariableRegex);
        setVariables((oldVariables) =>
          uniqBy([{
            placeholder: matches[0],
            name: matches[0].replace("{", "").replace("}", ""),
            value: "",
            type: VariableType.PATH,
          }, ...oldVariables], "name")
        );
      }
      return {
        text,
        matches,
        variable,
      };
    }).map((chunk) => {
      if (chunk.variable) {
        return (
          <span
            key={ulid()}
            className="variable dark:text-lime-500 text-orange-600"
          >
            {chunk.text}
          </span>
        );
      } else {
        return <span key={ulid()}>{chunk.text}</span>;
      }
    }).reduce<JSX.Element[]>((acc, chunk, index) => {
      acc.push(chunk);
      acc.push(
        <span key={`separator-${index}`} className="separator">
          /
        </span>,
      );
      return acc;
    }, []).slice(0, -1), [href]);

  async function toggleExpand(
    _event: React.MouseEvent<HTMLElement>,
  ): Promise<void> {
    const nextState = !isExpanded;
    setExpanded(nextState);
    if (nextState && !firstExpansion) {
      setFirstExpansion(true);
      if (variables.length === 0) {
        fetchEndpoint();
      }
    }
  }

  // The current URL with variables replaces
  const actualizedUrl = useMemo(() => {
    let url = href;
    variables.forEach((element) => {
      url = url.replace(element.placeholder, element.value);
    });

    return url;
  }, [href, variables]);

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: [componentId],
    queryFn: async ({ signal }) => {
      let url = actualizedUrl;
      if (queryParams.length) {
        url += "?" + queryParams.reduce((acc, item) => {
          acc.append(item.name, item.value);
          return acc;
        }, new URLSearchParams());
      }
      const response = await fetch(url, { signal });
      setResponseStatus(response.status);
      return await response.json();
    },
    enabled: false,
    retry: 0,
  });

  const fetchEndpoint = async () => {
    return refetch();
  };

  const formattedData = useMemo(() => {
    return data ? JSON.stringify(data, null, 2) : null;
  }, [data]);

  const onVariableChange = useCallback(
    (variable: VariableLike, event: ChangeEvent<HTMLInputElement>) => {
      if (variable.type === VariableType.PATH) {
        setVariables((oldVariables) => {
          return uniqBy([{
            name: variable.name,
            placeholder: variable.placeholder,
            value: event.target.value,
            type: VariableType.PATH,
          }, ...oldVariables], "name");
        });
      } else {
        variable.value = event.target.value;
      }
    },
    [],
  );

  function renderForm() {
    const hasSomethingToShow = queryParams.length + variables.length !== 0;
    if (hasSomethingToShow) {
      return (
        <EndpointForm
          disabled={isFetching}
          variables={[...variables, ...queryParams]}
          onSubmit={fetchEndpoint}
          onVariableChange={onVariableChange}
        >
        </EndpointForm>
      );
    } else {
      return (
        <button className="btn" onClick={fetchEndpoint}>Send request</button>
      );
    }
  }

  return (
    <div className="endpoint-outer p-4 basis-0 border border-transparent rounded-lg hover:border-gray-600 cursor-pointer">
      <div
        className="endpoint flex flex-row flex-wrap md:flex-nowrap justify-start items-center md:items-center"
        onClick={toggleExpand}
      >
        <div className="w-20">
          <Pill label={verb} tint={tintFor(verb)}></Pill>
        </div>
        <p className="w-[calc(100%-6rem)] ml-4 md:ml-2 md:w-auto text-xl font-mono">
          {urlNode}
        </p>
        <p className="!ml-24 md:!ml-2 w-auto text-gray-400 dark:text-slate-600">
          {description}
        </p>
      </div>

      {isExpanded &&
        (
          <div className="endpoint-inter mt-4">
            {renderForm()}

            <Suspense>
              {is2xx(responseStatus) && !isNull(formattedData)
                ? (
                  <Highlight className="rounded-lg mt-4">
                    {formattedData}
                  </Highlight>
                )
                : is4xx(responseStatus)
                ? <Stylish404></Stylish404>
                : <></>}
            </Suspense>
          </div>
        )}
    </div>
  );
};
