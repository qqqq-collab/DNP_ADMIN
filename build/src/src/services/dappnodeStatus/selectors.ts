import { mountPoint, autoUpdateIds } from "./data";
import { createSelector } from "reselect";
import { DappnodeStatusState } from "./types";
import { getDnpInstalled } from "services/dnpInstalled/selectors";

// Service > dappnodeStatus

export const getLocal = (state: any): DappnodeStatusState => state[mountPoint];

// Sub-local properties
export const getSystemInfo = (state: any) => getLocal(state).systemInfo;
export const getDappnodeParams = getSystemInfo;
export const getDappnodeStats = (state: any) => getLocal(state).stats;
export const getDappnodeDiagnose = (state: any) => getLocal(state).diagnose;
export const getPing = (state: any) => getLocal(state).pingReturns;
export const getVersionData = (state: any) =>
  (getLocal(state).systemInfo || {}).versionData;
export const getIpfsConnectionStatus = (state: any) =>
  getLocal(state).ipfsConnectionStatus;
export const getWifiStatus = (state: any) => getLocal(state).wifiStatus;
export const getPasswordIsInsecure = (state: any) =>
  getLocal(state).passwordIsInsecure;
export const getAutoUpdateData = (state: any) => getLocal(state).autoUpdateData;
export const getIdentityAddress = (state: any) =>
  (getSystemInfo(state) || {}).identityAddress;
export const getMountpoints = (state: any) => getLocal(state).mountpoints;
export const getVolumes = (state: any) => getLocal(state).volumes;

// Sub-sub local properties
export const getDappmanagerVersionData = (state: any) =>
  (getSystemInfo(state) || {}).versionData;
export const getVpnVersionData = (state: any) => getLocal(state).vpnVersionData;
export const getDappmanagerPing = (state: any) => getPing(state).dappmanager;
export const getVpnPing = (state: any) => getPing(state).vpn;
export const getEthClientTarget = (state: any) =>
  (getSystemInfo(state) || {}).ethClientTarget;
export const getEthClientStatus = (state: any) =>
  (getSystemInfo(state) || {}).ethClientStatus;
export const getEthClientFallback = (state: any) =>
  (getSystemInfo(state) || {}).ethClientFallback;
export const getIsFirstTimeRunning = (state: any) =>
  (getSystemInfo(state) || {}).isFirstTimeRunning;
export const getNewFeatureIds = (state: any) =>
  (getSystemInfo(state) || {}).newFeatureIds;

/**
 * Returns the DAppNode "network" identity to be shown in the TopBar
 * @returns {object} params = {
 *   name: "MyDappNode",
 *   staticIp: "85.84.83.82" (optional)
 *   domain: "ab318d2.dyndns.io" (optional, if no staticIp)
 *   ip: "85.84.83.82" (optional, if no staticIp)
 * }
 * [Tested]
 */
export const getDappnodeIdentityClean = (state: any) => {
  const systemInfo = getSystemInfo(state);
  if (systemInfo) {
    // If the static IP is set, don't show the regular IP
    const { ip, name, staticIp, domain } = systemInfo;
    if (staticIp) return { name, staticIp };
    else return { name, domain, ip };
  } else {
    return {};
  }
};

export const getStaticIp = (state: any) =>
  (getSystemInfo(state) || {}).staticIp || "";

export const getUpnpAvailable = (state: any) =>
  (getSystemInfo(state) || {}).upnpAvailable;

export const getIsWifiRunning = (state: any) =>
  (getWifiStatus(state) || {}).running;

export const getIsCoreAutoUpdateActive = createSelector(
  getAutoUpdateData,
  autoUpdateData =>
    (
      ((autoUpdateData || {}).settings || {})[autoUpdateIds.SYSTEM_PACKAGES] ||
      {}
    ).enabled
);

/**
 * There are a few edge cases which the user must be warned about
 * but since they depend on a `docker ps` its best to compute the warning
 * in the UI dynamically than in the DAPPMANAGER statically. Otherwise
 * the user will not see feedback that the warning is resolved.
 *
 * 1. if (!dnp) && status !== "installed", "selected", "error-installing"
 *    NOT-OK Client should be installed
 *    Something or someone removed the client, re-install?
 *  > Show an error or something in the UI as
 *    "Alert!" you target is OFF, go to remote or install it again
 *
 * 2. if (!dnp.running)
 *    Package can be stopped because the user stopped it or
 *    because the DAppNode is too full and auto-stop kicked in
 *  > Show an error or something in the UI as
 *    "Alert!" you target is OFF, go to remote or install it again
 *
 */
export const getEthMultiClientWarning = (
  state: any
): "not-installed" | "not-running" | undefined => {
  const status = getEthClientStatus(state);
  const target = getEthClientTarget(state);
  if (!target || target === "remote") return;

  const dnps = getDnpInstalled(state);
  if (!dnps || dnps.length === 0) return;

  // ### Todo: Decouple target => dnpName logic here
  const dnpName =
    target === "openethereum"
      ? "openethereum.dnp.dappnode.eth"
      : "geth.dnp.dappnode.eth";
  const dnp = dnps.find(dnp => dnp.name === dnpName);

  if (
    !dnp &&
    (status === "installed" ||
      status === "syncing" ||
      status === "active" ||
      status === "error-syncing")
  )
    return "not-installed";

  if (dnp && !dnp.running) return "not-running";
};
