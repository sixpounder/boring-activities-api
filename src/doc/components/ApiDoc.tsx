import { ApiEndpoint } from "./ApiEndpoint"

export const ApiDoc = () => {
    return <>
        <div className="container mx-auto my-4">
            <h1 className="text-4xl mb-8 text-center">Boring Activities API</h1>
            <div className="space-y-2">
                <ApiEndpoint
                    href="/api/activities"
                    verb="GET"
                    synopsis="Fetch all activities in the database"
                ></ApiEndpoint>
                <ApiEndpoint
                    href="/api/activities/{id}"
                    verb="GET"
                    synopsis="Get an activity by id"
                ></ApiEndpoint>
                <ApiEndpoint
                    href="/api/activities/random"
                    verb="GET"
                    synopsis="Get a random activity"
                ></ApiEndpoint>
                <ApiEndpoint
                    href="/api/activities/category/{category}"
                    verb="GET"
                    synopsis="Get all activities by category"
                ></ApiEndpoint>
            </div>
        </div>
    </>
}