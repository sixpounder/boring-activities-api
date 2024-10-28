import { PropsWithChildren, useMemo, useState } from "react";
import { Pill } from "./widgets/Pill";
import { ulid } from "ulid";
import { motion } from "framer-motion"
import { Activity } from "../../model/activity"
import { Terminal } from "./widgets/Terminal";
import Highlight from "react-highlight"
import "highlight.js/styles/night-owl.css"
import { isNull, startCase } from "lodash-es";

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiEndpointProps {
    href: string;
    verb: HttpVerb;
    expanded?: boolean;
    description?: string;
}

const pathVariableRegex = /\{([^\}\{]+)\}/gi;

export const ApiEndpoint = ({ href, verb, expanded = false, description = "" }: PropsWithChildren<ApiEndpointProps>) => {
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
    const [firstExpansion, setFirstExpansion] = useState(false)
    const [sampleResponse, setSampleResponse] = useState<Activity | Activity[]>(null)

    const [variables, _setVariables] = useState<
        { placeholder: string; name: string, value: string }[]
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
                    value: ""
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

    async function toggleExpand(_event: React.MouseEvent<HTMLElement>): Promise<void> {
        const nextState = !isExpanded;
        setExpanded(nextState)
        if (nextState && !firstExpansion) {
            setFirstExpansion(true);
            if (variables.length === 0) {
                fetchApi();
            }
        }
    }

    async function fetchApi() {
        try {
            const response = await fetch(actualizedUrl());
            const body: Activity[] = await response.json();
            setSampleResponse(body)
        } catch (e) {
            setSampleResponse(e.message);
        }
    }

    function actualizedUrl() {
        let url = href;
        variables.forEach(element => {
            url = url.replace(element.placeholder, element.value);
        });

        return url;
    }

    function renderForm() {
        if (variables.length) {
            return (
                <>
                    <form>
                        {
                            variables.map(v => {
                                return (
                                    <>
                                    <label htmlFor={`variable-${v.name}`}>{ startCase(v.name) }</label>
                                    <input
                                        id={`variable-${v.name}`}
                                        key={`variable-${v.name}`}
                                        type="text"
                                        defaultValue={ v.value }
                                        onChange={ event => v.value = event.target.value }
                                        placeholder={ startCase(v.name) }
                                        className="shadow border rounded w-full py-2 px-3 dark:border-slate-600 dark:bg-slate-700 bg-cyan-100 border-cyan-600 bg-opacity-35 dark:text-gray-200 text-neutral-800 leading-tight focus:outline-none focus:shadow-outline"
                                    ></input>
                                    </>
                                )
                            })
                        }
                    </form>
                    <button type="submit" className="btn mt-4" onClick={ fetchApi }>Send request</button>
                </>
            )
        } else {
            return (
                <button className="btn" onClick={ fetchApi }>Send request</button>
            )
        }
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
                <p className="!ml-24 md:!ml-2 w-auto text-gray-400 dark:text-slate-600">{ description }</p>
            </div>

            { isExpanded &&
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="endpoint-inter mt-4"
                >
                    { renderForm() }

                    { !isNull(sampleResponse) && <Highlight className="rounded-lg language-json p-4 mt-4">{ JSON.stringify(sampleResponse, null, 2) }</Highlight> }
                </motion.div>
            }
        </div>
    );
};
