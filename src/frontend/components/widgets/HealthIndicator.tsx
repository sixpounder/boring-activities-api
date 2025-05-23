import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useMemo } from "react";
import { is5xx } from "../../comms";
import { Pill, Tint } from "./Pill";
import { Loading } from "./Loading";

interface HealthIndicatorProps {
  /**
   * When disabled the automatic refetch interval will not fire any requests
   */
  enabled: boolean;

  /**
   * Fired when an updated service status is detected
   *
   * @param status The new service status
   * @returns
   */
  onStatusChanged: (status: "UP" | "DOWN" | "LIMITED" | "UNKNOWN") => void;
}

const HealthIndicator = (
  { onStatusChanged, enabled }: Partial<HealthIndicatorProps>,
) => {
  const { data: serviceStatusData, isError, isFetching } = useQuery<
    { status: "UP" | "DOWN" | "LIMITED"; responseStatus: number }
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
    enabled,
    retry: 1,
    refetchInterval: 10000,
  });

  const serviceStatusDataLabel: "UP" | "DOWN" | "LIMITED" | "UNKNOWN" = useMemo(
    () => {
      if (
        isError ||
        serviceStatusData?.responseStatus === 404 ||
        is5xx(serviceStatusData?.responseStatus)
      ) {
        return "DOWN";
      } else if (serviceStatusData?.status === "LIMITED") {
        return "LIMITED";
      } else {
        return serviceStatusData?.status ? serviceStatusData.status : "UNKNOWN";
      }
    },
    [serviceStatusData],
  );

  const serviceStatusTint: Tint = useMemo(() => {
    switch (serviceStatusDataLabel) {
      case "UP":
        return "green";
      case "DOWN":
        return "red";
      case "LIMITED":
      default:
        return "orange";
    }
  }, [serviceStatusDataLabel]);

  const debouncedIsFetching = useDebounce(isFetching, 500);

  useEffect(() => {
    if (onStatusChanged && serviceStatusData) {
      onStatusChanged(serviceStatusDataLabel);
    }
  }, [serviceStatusDataLabel]);

  return (
    <Pill
      tint={serviceStatusTint}
      className="text-xs px-2 py-1"
    >
      {debouncedIsFetching
        ? <Loading></Loading>
        : `Status: ${serviceStatusDataLabel}`}
    </Pill>
  );
};

export default HealthIndicator;
