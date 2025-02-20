export interface VariableLike<T = string> {
  placeholder: string;
  name: string;
  value: T;
  type: VariableType;
}

export enum VariableType {
  PATH = "Path variables",
  QUERY = "Query arguments",
}
