import {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Pill } from "./widgets/Pill";
import { ulid } from "ulid";
import { Highlight } from "./widgets/Highlight";
import { isNull, startCase, uniqBy } from "lodash-es";
import { useQuery, useQueryClient } from "react-query";

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiEndpointProps {
  href: string;
  verb: HttpVerb;
  expanded?: boolean;
  description?: string;
  queryParams?: VariableLike[];
}

interface VariableLike {
  placeholder: string;
  name: string;
  value: any;
}

const pathVariableRegex = /\{([^\}\{]+)\}/gi;

export const ApiEndpoint = (
  { href, verb, expanded = false, description = "", queryParams = [] }:
    PropsWithChildren<ApiEndpointProps>,
) => {
  const componentId = useMemo(ulid, []);

  function tintFor(verb: HttpVerb): "green" | "red" | "orange" | "blue" {
    switch (verb) {
      case "GET":
        return "blue";
      case "POST":
        return "green";
      case "PUT":
        return "orange";
      case "PATCH":
        return "orange";
      case "DELETE":
        return "red";
    }
  }

  const [isExpanded, setExpanded] = useState(expanded);
  const [firstExpansion, setFirstExpansion] = useState(false);

  const [variables, setVariables] = useState<
    VariableLike[]
  >([]);

  const urlNode: JSX.Element[] = useMemo(() =>
    href.split("/").map((text) => {
      const variable = pathVariableRegex.test(text);
      let matches: RegExpMatchArray;
      if (variable) {
        matches = text.match(pathVariableRegex);
        variables.push({
          placeholder: matches[0],
          name: matches[0].replace("{", "").replace("}", ""),
          value: "",
        });
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
    queryKey: componentId,
    queryFn: async ({ signal }) => {
      let url = actualizedUrl;
      if (queryParams.length) {
        url += "?" + queryParams.reduce((acc, item) => {
          acc.append(item.name, item.value);
          return acc;
        }, new URLSearchParams());
      }
      const response = await fetch(url, { signal });
      return response.json();
    },
    enabled: false,
  });

  const fetchEndpoint = async () => {
    return refetch();
  };

  const formattedData = useMemo(() => {
    return data ? JSON.stringify(data, null, 2) : null;
  }, [data]);

  const onVariableChange = useCallback(
    (variable: VariableLike, event: ChangeEvent<HTMLInputElement>) => {
      setVariables((oldVariables) => {
        return uniqBy([{
          name: variable.name,
          placeholder: variable.placeholder,
          value: event.target.value,
        }, ...oldVariables], "name");
      });
    },
    [],
  );

  const onQueryParamChange = useCallback(
    (param: VariableLike, event: ChangeEvent<HTMLInputElement>) => {
      param.value = event.target.value;
    },
    [],
  );

  function renderForm() {
    const hasSomethingToShow = queryParams.length + variables.length !== 0;
    if (hasSomethingToShow) {
      return (
        <>
          <form onSubmit={fetchEndpoint}>
            {variables.map((v) => {
              return (
                <div
                  key={`variable-${v.name}-label`}
                  className="flex flex-row items-center space-x-4 mt-4"
                >
                  <label className="w-32" htmlFor={`variable-${v.name}`}>
                    {startCase(v.name)}
                  </label>
                  <input
                    id={`variable-${v.name}`}
                    key={`variable-${v.name}`}
                    type="text"
                    defaultValue={v.value}
                    onChange={(event) => onVariableChange(v, event)}
                    placeholder={startCase(v.name)}
                    className="shadow border rounded w-full py-2 px-3 dark:border-slate-600 dark:bg-slate-700 bg-cyan-100 border-cyan-600 bg-opacity-35 dark:text-gray-200 text-neutral-800 leading-tight focus:outline-none focus:shadow-outline"
                  >
                  </input>
                </div>
              );
            })}

            {queryParams.map((v) => {
              return (
                <div
                  key={`variable-${v.name}-label`}
                  className="flex flex-row items-center space-x-4 mt-4"
                >
                  <label className="w-32" htmlFor={`variable-${v.name}`}>
                    {startCase(v.name)}
                  </label>
                  <input
                    id={`variable-${v.name}`}
                    key={`variable-${v.name}`}
                    type="text"
                    defaultValue={v.value}
                    onChange={(event) => onQueryParamChange(v, event)}
                    placeholder={startCase(v.name)}
                    className="shadow border rounded w-full py-2 px-3 dark:border-slate-600 dark:bg-slate-700 bg-cyan-100 border-cyan-600 bg-opacity-35 dark:text-gray-200 text-neutral-800 leading-tight focus:outline-none focus:shadow-outline"
                  >
                  </input>
                </div>
              );
            })}
            <button
              type="submit"
              className="btn mt-4"
              disabled={isFetching}
              onClick={(e) => {
                e.preventDefault();
                fetchEndpoint();
              }}
            >
              Send request
            </button>
          </form>
        </>
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

            {!isNull(formattedData) && (
              <Highlight className="rounded-lg language-json mt-4">
                {formattedData}
              </Highlight>
            )}
          </div>
        )}
    </div>
  );
};
