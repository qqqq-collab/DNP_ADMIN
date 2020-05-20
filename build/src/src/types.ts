import { UserActionLog, PackageVersionData, DiagnoseItem } from "common/types";

export * from "./common/types";

export interface UserActionLogWithCount extends UserActionLog {
  count?: number;
}

export interface DiagnoseObj {
  [diagnoseId: string]: DiagnoseItem;
}

// Window extension

declare global {
  interface Window {
    versionData?: PackageVersionData;
  }
}
