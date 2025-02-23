import { ulid } from "ulid";
import { alternate } from "../../collections";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface UrlProps {
  url: string;
}

interface ChunkDefinition {
  text: string;
  variable: boolean;
  matches: RegExpMatchArray;
}

const PATH_VARIABLE_REGEX = /\{([^}{]+)\}/gi;
const EMPTY_CHUNKS: ChunkDefinition[] = [];

export const Url = ({ url }: UrlProps) => {
  const [chunksDefinitions, setChunksDefinitions] = useState(EMPTY_CHUNKS);

  const cleanupChunksDefinitions = useCallback(() => {
    setChunksDefinitions(EMPTY_CHUNKS);
  }, []);

  useEffect(() => {
    url.split("/").map((chunk) => {
      const variable = PATH_VARIABLE_REGEX.test(chunk);
      const matches: RegExpMatchArray | undefined = variable
        ? chunk.match(PATH_VARIABLE_REGEX)
        : undefined;

      setChunksDefinitions((existingChunks) => [
        ...existingChunks,
        {
          text: chunk,
          variable,
          matches,
        },
      ]);
    });

    return cleanupChunksDefinitions;
  }, [url]);

  const chunks = useMemo(() => {
    return chunksDefinitions.map((chunk) => {
      if (chunk.variable) {
        return (
          <span
            key={chunk.text}
            className="variable dark:text-lime-500 text-green-600"
          >
            {chunk.text}
          </span>
        );
      } else {
        return <span key={ulid()}>{chunk.text}</span>;
      }
    });
  }, [chunksDefinitions]);

  return alternate(
    chunks,
    (chunk) => <span className="" key={`chunk-${chunk.key}-separator`}>/</span>,
  ).slice(0, -1);
};
