import { PropsWithChildren, ReactNode, useMemo, useState } from "react";
import { Pill } from "./widgets/Pill";
import { ulid } from "ulid";
import { motion } from "framer-motion"

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiEndpointProps {
    href: string;
    verb: HttpVerb;
    expanded?: boolean;
    synopsis?: string;
    description?: ReactNode | string
}

const pathVariableRegex = /\{([^\}\{]+)\}/gi;

export const ApiEndpoint = ({ href, verb, expanded = false, synopsis, description = "", children }: PropsWithChildren<ApiEndpointProps>) => {
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

    const [isExpanded, setExpanded] = useState(expanded)

    const [variables, setVariables] = useState<
        { placeholder: string; name: string }[]
    >([]);

    const urlNode: JSX.Element[] = useMemo(() =>
        href.split("/").map((s) => {
            const variable = pathVariableRegex.test(s);
            let matches;
            if (variable) {
                matches = s.matchAll(pathVariableRegex);
                variables.push({
                    placeholder: variable[0],
                    name: variable[1],
                });
            }
            return {
                text: s,
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

    function toggleExpand(event: React.MouseEvent<HTMLElement>): void {
        setExpanded(!isExpanded)
    }

    return (
        <div className="endpoint-outer p-4 basis-0 border border-transparent rounded-lg hover:border-gray-600 cursor-pointer">
            <div className="endpoint flex flex-row flex-wrap md:flex-nowrap justify-start items-center md:items-center" onClick={toggleExpand}>
                <div className="w-20">
                    <Pill label={verb} tint={tintFor(verb)}></Pill>
                </div>
                <p className="w-[calc(100%-6rem)] ml-4 md:ml-2 md:w-auto text-xl font-mono">
                    {urlNode}
                </p>
                <p className="!ml-24 md:!ml-2 w-auto text-gray-400 dark:text-slate-600">{ synopsis }</p>
            </div>

            { isExpanded &&
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="endpoint-inter"
                >
                    <div className="my-2">{ description }</div>
                    <button className="btn">Send request</button>
                </motion.div>
            }
        </div>
    );
};
