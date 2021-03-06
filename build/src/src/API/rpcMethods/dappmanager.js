/**
 * DAPPMANAGER WAMP RPC METHODS
 * This file describes the available RPC methods of the DAPPMANAGER module
 * It serves as documentation and as a mechanism to quickly add new calls
 *
 * Each key of this object is the last subdomain of the entire event:
 *   event = "installPackage.dappmanager.dnp.dappnode.eth"
 *   object key = "installPackage"
 */

export default {
  /**
   * [ping]
   * Default method to check if app is alive
   *
   * @returns {*}
   */
  ping: {},

  /**
   * Returns a auto-update data:
   * - settings: If auto-updates are enabled for a specific DNP or DNPs
   * - registry: List of executed auto-updates
   * - pending: Pending auto-update per DNP, can be already executed
   * - dnpsToShow: Parsed data to be shown in the UI
   *
   * @returns {object} result = {
   *   settings: {
   *     "system-packages": { enabled: true }
   *     "my-packages": { enabled: true }
   *     "bitcoin.dnp.dappnode.eth": { enabled: false }
   *   },
   *   registry: { "core.dnp.dappnode.eth": {
   *     "0.2.4": { updated: 1563304834738, successful: true },
   *     "0.2.5": { updated: 1563304834738, successful: false }
   *   }, ... },
   *   pending: { "core.dnp.dappnode.eth": {
   *     version: "0.2.4",
   *     firstSeen: 1563218436285,
   *     scheduledUpdate: 1563304834738,
   *     completedDelay: true
   *   }, ... },
   *   dnpsToShow: [{
   *     id: "system-packages",
   *     displayName: "System packages",
   *     enabled: true,
   *     feedback: {
   *       updated: 15363818244,
   *       manuallyUpdated: true,
   *       inQueue: true,
   *       scheduled: 15363818244
   *     }
   *   }, ... ]
   * }
   */
  autoUpdateDataGet: {},

  /**
   * Edits the auto-update settings
   *
   * @param {string} id = "my-packages", "system-packages" or "bitcoin.dnp.dappnode.eth"
   * @param {bool} enabled Auto update is enabled for ID
   */
  autoUpdateSettingsEdit: {
    mandatoryKwargs: ["id", "enabled"]
  },

  /**
   * Does a backup of a DNP and sends it to the client for download.
   *
   * @param {string} id DNP .eth name
   * @param {array} backup [
   *   { name: "config", path: "/usr/.raiden/config" },
   *   { name: "keystore", path: "/usr/.raiden/secret/keystore" }
   * ]
   * @returns {string} fileId = "64020f6e8d2d02aa2324dab9cd68a8ccb186e192232814f79f35d4c2fbf2d1cc"
   */
  backupGet: {
    mandatoryKwargs: ["id", "backup"]
  },

  /**
   * Restore a previous backup of a DNP, from the dataUri provided by the user
   *
   * @param {string} id DNP .eth name
   * @param {string} fileId = "64020f6e8d2d02aa2324dab9cd68a8ccb186e192232814f79f35d4c2fbf2d1cc"
   * @param {array} backup [
   *   { name: "config", path: "/usr/.raiden/config" },
   *   { name: "keystore", path: "/usr/.raiden/secret/keystore" }
   * ]
   */
  backupRestore: {
    mandatoryKwargs: ["id", "backup", "fileId"]
  },

  /**
   * [changeIpfsTimeout]
   * Used to test different IPFS timeout parameters live from the ADMIN UI.
   *
   * @param {(string|number)} timeout new IPFS timeout in ms
   */
  changeIpfsTimeout: {
    mandatoryKwargs: ["timeout"]
  },

  /**
   * [cleanCache]
   * Cleans the cache files of the DAPPMANAGER:
   * - local DB
   * - user action logs
   * - temp transfer folder
   */
  cleanCache: {},

  /**
   * [copyFileFrom]
   * Copy file from a DNP and download it on the client
   *
   * @param {string} id DNP .eth name
   * @param {string} fromPath path to copy file from
   * - If path = path to a file: "/usr/src/app/config.json".
   *   Downloads and sends that file
   * - If path = path to a directory: "/usr/src/app".
   *   Downloads all directory contents, tar them and send as a .tar.gz
   * - If path = relative path: "config.json".
   *   Path becomes $WORKDIR/config.json, then downloads and sends that file
   *   Same for relative paths to directories.
   * @returns {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
   */
  copyFileFrom: {
    mandatoryKwargs: ["id", "fromPath"]
  },

  /**
   * [copyFileTo]
   * Copy file to a DNP
   *
   * @param {string} id DNP .eth name
   * @param {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
   * @param {string} filename name of the uploaded file.
   * - MUST NOT be a path: "/app", "app/", "app/file.txt"
   * @param {string} toPath path to copy a file to
   * - If path = path to a file: "/usr/src/app/config.json".
   *   Copies the contents of dataUri to that file, overwritting it if necessary
   * - If path = path to a directory: "/usr/src/app".
   *   Copies the contents of dataUri to ${dir}/${filename}
   * - If path = relative path: "config.json".
   *   Path becomes $WORKDIR/config.json, then copies the contents of dataUri there
   *   Same for relative paths to directories.
   */
  copyFileTo: {
    mandatoryKwargs: ["id", "dataUri", "filename", "toPath"]
  },

  /**
   * [diagnose]
   * Returns a list of checks done as a diagnose
   *
   * @returns {object} diagnoses object, by diagnose id
   * diagnoses = {
   *   "dockerVersion": {
   *     name: "docker version",
   *     result: "Docker version 18.06.1-ce, build e68fc7a"
   *       <or>
   *     error: "sh: docker: not found"
   *   }
   * }
   */
  diagnose: {},

  /**
   * Fetches the core update data, if available
   *
   * @returns {object} result = {
   *   available: true {bool},
   *   type: "minor",
   *   packages: [
   *     {
   *       name: "core.dnp.dappnode.eth",
   *       from: "0.2.5",
   *       to: "0.2.6",
   *       manifest: {}
   *     },
   *     {
   *       name: "admin.dnp.dappnode.eth",
   *       from: "0.2.2",
   *       to: "0.2.3",
   *       manifest: {}
   *     }
   *   ],
   *   changelog: "Changelog text",
   *   updateAlerts: [{ message: "Specific update alert"}, ... ],
   *   versionId: "admin@0.2.6,core@0.2.8"
   * }
   */
  fetchCoreUpdateData: {},

  /**
   * [fetchPackageVersions]
   * Fetches all available version manifests from a package APM repo
   *
   * @param {string} id DNP .eth name
   * @returns {array} dnpsWithVersions = [{
   *   version: "0.0.4", {string}
   *   manifest: <Manifest object> {object}
   * }, ... ]
   */
  fetchPackageVersions: {
    mandatoryKwargs: ["id"]
  },

  /**
   * [getParams]
   * Returns the current DAppNode identity
   *
   * @returns = {
   *   ip: "85.84.83.82",
   *   name: "My-DAppNode",
   *   staticIp: "85.84.83.82" | null,
   *   domain: "1234acbd.dyndns.io",
   *   upnpAvailable: true | false,
   *   noNatLoopback: true | false,
   *   alertToOpenPorts: true | false,
   *   internalIp: 192.168.0.1,
   * }
   */
  getParams: {},

  /**
   * [getStats]
   * Computes the current usage % of cpu, memory and disk
   *
   * @returns {object} status = {
   *   cpu: "35%", {string}
   *   memory: "46%", {string}
   *   disk: "57%", {string}
   * }
   */
  getStats: {},

  /**
   * [getUserActionLogs]
   * Returns the user action logs. This logs are stored in a different
   * file and format, and are meant to ease user support
   * The list is ordered from newest to oldest
   * - Newest log has index = 0
   * - If the param fromLog is out of bounds, the result will be an empty array: []
   *
   * @param {number} fromLog, default value = 0
   * @param {number} numLogs, default value = 50
   * @returns {string} logs, stringified userActionLog JSON objects appended on new lines
   * To parse, by newline and then parse each line individually.
   * userActionLog = {
   *   level: "info" | "error", {string}
   *   event: "installPackage.dnp.dappnode.eth", {string}
   *   message: "Successfully install DNP", {string} Returned message from the call function
   *   result: { data: "contents" }, {*} Returned result from the call function
   *   kwargs: { id: "dnpName" }, {object} RPC key-word arguments
   *   // Only if error
   *   message: e.message, {string}
   *   stack.e.stack {string}
   * }
   */
  getUserActionLogs: {},

  /**
   * [getVersionData]
   *  Returns version data
   *
   * @returns {object} versionData = {
   *   version: "0.1.21",
   *   branch: "master",
   *   commit: "ab991e1482b44065ee4d6f38741bd89aeaeb3cec"
   * }
   */
  getVersionData: {},

  /**
   * [installPackageSafe]
   * Installs a package in safe mode, by setting options.BYPASS_RESOLVER = true
   *
   *
   * @param {string} id DNP .eth name
   * @param {object} options install options
   * - BYPASS_CORE_RESTRICTION: Allows dncore DNPs from unverified sources (IPFS)
   * options = { BYPASS_CORE_RESTRICTION: true }
   */
  installPackageSafe: {
    mandatoryKwargs: ["id"]
  },

  /**
   * [logPackage]
   * Returns the logs of the docker container of a package
   *
   * @param {string} id DNP .eth name
   * @param {object} options log options
   * - timestamp {bool}: Show timestamps
   * - tail {number}: Number of lines to return from bottom
   * options = { timestamp: true, tail: 200 }
   * @returns {string} logs: <string with escape codes>
   */
  logPackage: {
    mandatoryKwargs: ["id", "options"]
  },

  /**
   * [managePorts]
   * Open or closes requested ports
   *
   * @param {string} action: "open" or "close" (string)
   * @param {array} ports: array of port objects
   * ports = [ { portNumber: 30303, protocol: TCP }, ... ]
   */
  managePorts: {
    mandatoryKwargs: ["ports", "action"]
  },

  /**
   * Returns the public key of nacl's asymmetric encryption,
   * to be used by the ADMIN UI to send sensitive data in a slightly
   * more protected way.
   *
   * @param {string} publicKey
   */
  naclEncryptionGetPublicKey: {},

  /**
   * [notificationsGet]
   * Returns not viewed notifications
   *
   * @returns {object} notifications object, by notification id
   * notifications = {
   *   "diskSpaceRanOut-stoppedPackages": {
   *     id: "diskSpaceRanOut-stoppedPackages",
   *     type: "danger",
   *     title: "Disk space ran out, stopped packages",
   *     body: "Available disk space is less than a safe ...",
   *   }
   * }
   */
  notificationsGet: {},

  /**
   * [notificationsRemove]
   * Marks notifications as view by deleting them from the db
   *
   * @param {array} ids Array of ids to be marked as read
   * ids = [ "notification-id1", "notification-id2" ]
   */
  notificationsRemove: {
    mandatoryKwargs: ["ids"]
  },

  /**
   * [notificationsTest]
   * Adds a notification to be shown the UI.
   * Set the notification param to null (or send none) to generate
   * a random notification
   *
   * @param {(null|Object)} notification: {
   *   id: "notification-id", {string}
   *   type: "danger", {string}
   *   title: "Some notification", {string},
   *   body: "Some text about notification" {string}
   * }
   */
  notificationsTest: {},

  /**
   * Checks if the user `dappnode`'s password in the host machine
   * is NOT the insecure default set at installation time.
   * It does so by checking if the current salt is `insecur3`
   *
   * - This check will be run every time this node app is started
   *   - If the password is SECURE it will NOT be run anymore
   *     and this call will return true always
   *   - If the password is INSECURE this check will be run every
   *     time the admin requests it (on page load)
   *
   * @returns {bool} true = is secure / false = is not
   */
  passwordIsSecure: {},

  /**
   * Instruct the host to poweroff
   */
  poweroffHost: {},

  /**
   * Instruct the host to reboot
   */
  rebootHost: {},

  /**
   * [removePackage]
   * Remove package data: docker down + disk files
   *
   * @param {string} id DNP .eth name
   * @param {bool} deleteVolumes flag to also clear permanent package data
   */
  removePackage: {
    mandatoryKwargs: ["id", "deleteVolumes"]
  },

  /**
   * [requestChainData]
   * Requests chain data. Also instructs the DAPPMANAGER
   * to keep sending data for a period of time (5 minutes)
   */
  requestChainData: {},

  /**
   * [resolveRequest]
   * Resolves a DNP request given the current repo state fetched
   * from the blockchain and the current installed DNPs versions
   *
   * @param {object} req, DNP request to resolve
   * req = {
   *   name: "otpweb.dnp.dappnode.eth", {string}
   *   ver: "0.1.4" {string}
   * }
   * @returns {object} result  = {
   *   state: {"admin.dnp.dappnode.eth": "0.1.4"},
   *   alreadyUpdated: {"bind.dnp.dappnode.eth": "0.1.2"},
   * }
   */
  resolveRequest: {
    mandatoryKwargs: ["req"]
  },

  /**
   * [restartPackage]
   * Calls docker rm and docker up on a package
   *
   * @param {string} id DNP .eth name
   */
  restartPackage: {
    mandatoryKwargs: ["id"]
  },

  /**
   * [restartPackageVolumes]
   * Removes a package volumes. The re-ups the package
   *
   * @param {string} id DNP .eth name
   */
  restartPackageVolumes: {
    mandatoryKwargs: ["id"]
  },

  /**
   * Returns the public key of the seedPhrase currently stored if any.
   * If it's not stored yet, it's an empty string
   *
   * @returns {string} publicKey
   */
  seedPhraseGetPublicKey: {},

  /**
   * Receives an encrypted message containing the seed phrase of
   * 12 word mnemonic ethereum account. The extra layer of encryption
   * slightly increases the security of the exchange while the WAMP
   * module works over HTTP.
   *
   * @param {string} seedPhraseEncrypted tweetnacl base64 box with nonce
   */
  seedPhraseSet: {
    mandatoryKwargs: ["seedPhraseEncrypted"]
  },

  /**
   * [setStaticIp]
   * Sets the static IP
   *
   * @param {string} staticIp New static IP
   * - To enable: "85.84.83.82"
   * - To disable: ""
   */
  setStaticIp: {
    mandatoryKwargs: ["staticIp"]
  },

  /**
   * [togglePackage]
   * Stops or starts after fetching its status
   *
   * @param {string} id DNP .eth name
   * @param {number} timeout seconds to stop the package
   */
  togglePackage: {
    mandatoryKwargs: ["id"]
  },

  /**
   * [updatePackageEnv]
   * Updates the .env file of a package. If requested, also re-ups it
   *
   * @param {string} id DNP .eth name
   * @param {object} envs environment variables
   * envs = {
   *   ENV_NAME: ENV_VALUE
   * }
   * @param {bool} restart flag to restart the DNP
   */
  updatePackageEnv: {
    mandatoryKwargs: ["id", "envs", "restart"]
  },

  /**
   * Updates the .env file of a package. If requested, also re-ups it
   *
   * @param {string} id DNP .eth name
   * @param {array} portMappings [
   *   { host: 30444, container: 30303, protocol: "UDP" },
   *   { host: 4000, container: 4000, protocol: "TCP" }
   * ]
   * #### !!!!! NOTE take into account existing ephemeral ports
   */
  updatePortMappings: {
    mandatoryKwargs: ["id", "portMappings"]
  }
};
