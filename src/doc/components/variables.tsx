export interface VariableLike {
  placeholder: string;
  name: string;
  value: any;
  type: VariableType;
}

export enum VariableType {
  PATH = "Path variables",
  QUERY = "Query arguments",
}
