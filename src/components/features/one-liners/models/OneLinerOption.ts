import {ReactNode} from "react";

export type OneLinerOption<V extends string> = {
  value: V;
  label: string;
  icon: ReactNode;
};
