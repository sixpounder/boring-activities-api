import { ApiEndpoint } from "./ApiEndpoint";
import { VariableType } from "./variables";
import { Pill } from "./widgets/Pill";
import HealthIndicator from "./widgets/HealthIndicator";
import { useCallback, useMemo, useState } from "react";
import { Freeze } from "./widgets/Freeze";

export const ApiDoc = () => {
  const [serviceStatus, setServiceStatus] = useState<
    "UP" | "DOWN" | "LIMITED" | "UNKNOWN"
  >("UNKNOWN");
  const onServiceStatusChanged = useCallback(
    (status: "UP" | "DOWN" | "LIMITED" | "UNKNOWN") => {
      setServiceStatus(status);
    },
    [],
  );

  const serviceIsDown = useMemo(() => serviceStatus === "DOWN", [
    serviceStatus,
  ]);

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-4xl mb-8 text-center flex flex-col justify-center items-center gap-4">
        <span>Boring Activities API</span>
        <div className="flex flex-row justify-center items-center gap-x-2">
          <Pill
            tint="green"
            className="text-xs px-2 py-1"
          >
            Version: {BA_VERSION}
          </Pill>
          <HealthIndicator onStatusChanged={onServiceStatusChanged}>
          </HealthIndicator>
        </div>
      </h1>
      <Freeze className="space-y-2" effect="blur" enabled={serviceIsDown}>
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
      </Freeze>
    </div>
  );
};
