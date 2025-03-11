import {
  ChangeEvent,
  lazy,
  memo,
  PropsWithChildren,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Tint } from "./widgets/Pill";
import { Pill } from "./widgets/Pill";
import { ulid } from "ulid";
import { isUndefined, uniqBy } from "lodash-es";
import { useQuery } from "@tanstack/react-query";
import { VariableLike, VariableType } from "./variables";
import { EndpointForm } from "./widgets/EndpointForm";
import type { HttpVerb } from "../comms";
import { is2xx, is4xx } from "../comms";
import { Url } from "./widgets/Url";
import Center from "./widgets/Center";
import { useDebounce } from "@uidotdev/usehooks";
import { Loading } from "./widgets/Loading";

interface ApiEndpointProps {
  href: string;
  verb: HttpVerb;
  expanded?: boolean;
  description?: string;
  queryParams?: VariableLike[];
}

const pathVariableRegex = /\{([^}{]+)\}/gi;
const EMPTY_PARAMS: VariableLike[] = [];
const EMPTY_VARIABLES: VariableLike[] = [];

const Stylish4xx = lazy(() => import("./widgets/Stylish4xx"));
const Response = lazy(() =>
  import("./widgets/Response").then((module) => ({
    default: module.Response,
  }))
);

export const ApiEndpoint = (
  {
    href,
    verb,
    expanded = false,
    description = "",
    queryParams = EMPTY_PARAMS,
  }: PropsWithChildren<ApiEndpointProps>,
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

  const [variables, setVariables] = useState<
    VariableLike[]
  >(EMPTY_VARIABLES);

  useEffect(() => {
    href.split("/").map((text) => {
      const variable = pathVariableRegex.test(text);
      let matches: RegExpMatchArray | null = null;
      if (variable) {
        matches = text.match(pathVariableRegex)!;
        setVariables((oldVariables) =>
          uniqBy([{
            placeholder: matches![0],
            name: matches![0].replace("{", "").replace("}", ""),
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
    });

    return () => {
      setVariables(EMPTY_VARIABLES);
    };
  }, [href]);

  function toggleExpand(
    _event: React.MouseEvent<HTMLElement>,
  ): void {
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

  const { data, isFetching: isLoading, refetch } = useQuery({
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
      let parsedBody: Record<string | symbol, unknown> = {};
      if (is2xx(response.status)) {
        parsedBody = await response.json();
      }

      return {
        response: parsedBody,
        headers: response.headers,
        status: response.status,
      } as { response: unknown; status: number; headers: Headers };
    },
    enabled: false,
    retry: 0,
  });

  const fetchEndpoint = useCallback(async () => {
    return await refetch();
  }, []);

  const fetchStatus = useMemo(() => {
    return data ? data.status : undefined;
  }, [data]);

  const onVariableChange = useCallback(
    (variable: VariableLike<unknown>, event: ChangeEvent<HTMLInputElement>) => {
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

  const MemoizedEndpointForm = memo(EndpointForm);
  const isFetchingFromAWhile = useDebounce(isLoading, 500);

  return (
    <div className="endpoint-outer p-4 basis-0 border border-transparent rounded-lg hover:border-gray-600 cursor-pointer">
      <div
        className="endpoint flex flex-row flex-wrap md:flex-nowrap justify-start items-center md:items-center"
        onClick={toggleExpand}
      >
        <div className="w-20">
          <Pill tint={tintFor(verb)}>
            {verb}
          </Pill>
        </div>
        <p className="w-[calc(100%-6rem)] ml-4 md:ml-2 md:w-auto text-xl font-mono">
          <Url url={href}></Url>
        </p>
        <p className="!ml-24 md:!ml-2 w-auto text-gray-400 dark:text-slate-600">
          {description}
        </p>
      </div>

      {isExpanded &&
        (
          <div className="endpoint-inter mt-4">
            <MemoizedEndpointForm
              disabled={isLoading}
              variables={[...variables, ...queryParams]}
              onSubmit={fetchEndpoint}
              onVariableChange={onVariableChange}
            >
            </MemoizedEndpointForm>

            <Suspense>
              <Center>
                {isFetchingFromAWhile && <Loading></Loading>}
                {is2xx(fetchStatus) && !isUndefined(data)
                  ? (
                    <Response
                      data={data.response}
                      headers={data.headers}
                      className="mt-4"
                    >
                    </Response>
                  )
                  : is4xx(fetchStatus)
                  ? <Stylish4xx></Stylish4xx>
                  : null}
              </Center>
            </Suspense>
          </div>
        )}
    </div>
  );
};
