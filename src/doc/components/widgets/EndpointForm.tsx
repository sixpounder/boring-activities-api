import { defaults, groupBy, keysIn, startCase } from "lodash-es";
import { VariableLike } from "../variables";
import { ChangeEvent, FormEvent, useCallback, useMemo } from "react";

export interface EndpointFormProps {
  variables: VariableLike[];
  disabled: boolean;
  onVariableChange: (
    variable: VariableLike,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onSubmit: () => void;
}

const propsDefaults = {
  variables: [] as VariableLike[],
  disabled: false,
  onVariableChange: () => {},
  onSubmit: () => {},
};

export const EndpointForm = (props: Partial<EndpointFormProps>) => {
  const { variables, disabled, onVariableChange, onSubmit } = {
    ...propsDefaults,
    ...props,
  };

  const onFormSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  }, []);

  const partitionedVariables = useMemo(() => groupBy(variables, "type"), [
    variables,
  ]);

  return (
    <form onSubmit={onFormSubmit}>
      {keysIn(partitionedVariables).map((k) => {
        const partition = partitionedVariables[k];
        return [
          <h2 key={`partition-${k}`} className="font-bold text-sm uppercase">
            {k}
          </h2>,
          ...partition.map((v) => {
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
          }),
        ];
      })}

      <button
        type="submit"
        className="btn mt-4"
        disabled={disabled}
      >
        Send request
      </button>
    </form>
  );
};
