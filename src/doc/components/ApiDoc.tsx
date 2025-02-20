import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiEndpoint } from "./ApiEndpoint";
import { VariableType } from "./variables";

export const ApiDoc = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto my-4">
        <h1 className="text-4xl mb-8 text-center">Boring Activities API</h1>
        <div className="space-y-2">
          <ApiEndpoint
            href="/api/activities"
            verb="GET"
            description="Fetch all activities in the database"
            queryParams={[{
              placeholder: "Page",
              name: "page",
              value: 0,
              type: VariableType.QUERY,
            }, {
              placeholder: "Page size",
              name: "pageSize",
              value: 10,
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
    </QueryClientProvider>
  );
};
