import { useQuery } from "@tanstack/react-query";
import { ApiEndpoint } from "./ApiEndpoint";
import { VariableType } from "./variables";
import { Pill, Tint } from "./widgets/Pill";
import { useMemo } from "react";
import { is5xx } from "../comms";
import { Loading } from "./widgets/Loading";

export const ApiDoc = () => {
  const { data: serviceStatusData, isError, isFetching } = useQuery<
    { status: "UP" | "DOWN"; responseStatus: number }
  >({
    queryKey: ["status"],
    queryFn: async ({ signal }) => {
      const result = await fetch("/health", { signal });
      const response = await result.json();
      return {
        responseStatus: result.status,
        ...response,
      };
    },
    retry: 1,
    refetchInterval: 10000
  });

  const serviceStatusDataLabel: "UP" | "DOWN" | "UNKNOWN" = useMemo(() => {
    if (
      isError ||
      serviceStatusData?.responseStatus === 404 ||
      is5xx(serviceStatusData?.responseStatus)
    ) {
      return "DOWN";
    } else {
      return serviceStatusData?.status ? serviceStatusData.status : "UNKNOWN";
    }
  }, [serviceStatusData]);

  const serviceStatusTint: Tint = useMemo(() => {
    switch (serviceStatusDataLabel) {
      case "UP":
        return "green";
      case "DOWN":
        return "red";
      case "UNKNOWN":
      default:
        return "orange";
    }
  }, [serviceStatusDataLabel]);

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-4xl mb-8 text-center flex flex-col justify-center items-center gap-4">
        <span>Boring Activities API</span>
        <div className="flex flex-row justify-center items-center gap-x-2">
          <Pill
            tint="purple"
            className="text-xs px-2 py-1"
          >
            Version: {BA_VERSION}
          </Pill>
          <Pill
            tint={serviceStatusTint}
            className="text-xs px-2 py-1"
          >
            {isFetching
              ? <Loading></Loading>
              : `Status: ${serviceStatusDataLabel}`}
          </Pill>
        </div>
      </h1>
      <div className="space-y-2">
        <ApiEndpoint
          href="/api/activities"
          verb="GET"
          description="Fetch all activities in the database"
          queryParams={[{
            placeholder: "Page",
            name: "page",
            value: "0",
            type: VariableType.QUERY,
          }, {
            placeholder: "Page size",
            name: "pageSize",
            value: "10",
            type: VariableType.QUERY,
          }]}
        >
        </ApiEndpoint>
        <ApiEndpoint
          href="/api/activities/{id}"
          verb="GET"
          description="Get an activity by id"
        >
        </ApiEndpoint>
        <ApiEndpoint
          href="/api/activities/random"
          verb="GET"
          description="Get a random activity"
        >
        </ApiEndpoint>
        <ApiEndpoint
          href="/api/activities/category/{category}"
          verb="GET"
          description="Get all activities by category"
        >
        </ApiEndpoint>
      </div>
    </div>
  );
};
