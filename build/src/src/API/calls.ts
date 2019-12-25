import { wrapRoute } from "./wrapRoute";
import * as routes from "../route-types";

export const fetchCoreUpdateData = wrapRoute(routes.fetchCoreUpdateData);
export const fetchDirectory = wrapRoute(routes.fetchDirectory);
export const fetchDnpRequest = wrapRoute(routes.fetchDnpRequest);
export const installPackage = wrapRoute(routes.installPackage);
export const mountpointsGet = wrapRoute(routes.mountpointsGet);
export const packageDetailDataGet = wrapRoute(routes.packageDetailDataGet);
export const listPackages = wrapRoute(routes.listPackages);
export const packageGettingStartedToggle = wrapRoute(
  routes.packageGettingStartedToggle
);
