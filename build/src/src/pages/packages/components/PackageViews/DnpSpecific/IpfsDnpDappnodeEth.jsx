import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import ClipboardJS from "clipboard";
// Pages
import { rootPath as systemRootPath, addIpfsPeerPath } from "pages/system/data";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Button from "components/Button";
import Input from "components/Input";
// Icons
import { GoClippy } from "react-icons/go";
// Selectors
import { getDappnodeParams } from "services/dappnodeStatus/selectors";

const ipfsApiUrl = "http://ipfs.dappnode:5001/api/v0";

/**
 * curl "http://ipfs.dappnode:5001/api/v0/id"
 * {
 *   ID: "QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer",
 *   PublicKey: "AsDFGHJkKjHGfDsQwErTyUiKNDsdFGhjKkJhGFdSeRtYUiJhFDsdfGHjIGcG/bGeEo3+BYjFkjMLor/thjk8wq4chVNCj+VH8RuKzQrkCJr++1i3NFHpJaRsy0zuXPWRJcO2sRVJn6ZMUG1lM/cFlpBpb3VSj1AFeoIXec547Bz36Q7AQdKWxwskRBJ1gCo0unJ4lsBBongstuywTtPReLbki+jb3OgOwcfiRM/uq/kP0bq6rBzLRx0d5cYIo4cQdoN4IaL/99TEKji/sLOPZEQdzYq0UV6yk3uTpza9pq1kL6Nd4obY6F1QW7BUw/vunxHMThtD+j1+5M84FHLFWjRaoOnhJ6PLLzM0f40FOOvLUzdwdDm4eBXBjUZpWUO+mpoOAkwxAgMBAAE=",
 *   Addresses: [
 *     "/ip4/127.0.0.1/tcp/4001/ipfs/QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer",
 *     "/ip4/172.33.1.5/tcp/4001/ipfs/QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer",
 *     "/ip4/86.230.95.64/tcp/4001/ipfs/QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer"
 *   ],
 *   AgentVersion: "go-ipfs/0.4.20/8efc82534",
 *   ProtocolVersion: "ipfs/0.1.0"
 * }
 *
 * curl "http://ipfs.dappnode:5001/api/v0/bootstrap/add?arg=/dnsaddr/bacd1423acdb6231.dyndns.dappnode.io/tcp/4001/ipfs/QmWasdfghjklqwertyuioasdfghjqwertyuiasdfghjwer"
 * {
 *   "Peers":[ "/dnsaddr/bacd1423acdb6231.dyndns.dappnode.io/tcp/4001/ipfs/QmWAcZZCvqVnJ6J9946qxEMaAbkUj6FiiVWakizVKfnfDL" ]
 * }
 *
 * Multiaddress possible prefixes:
 * - /ip4/
 * - /dns4/
 * - /dnsaddr/
 */

function IpfsDnpDappnodeEth({ dappnodeParams }) {
  const { staticIp, domain } = dappnodeParams || {};

  const [peerId, setPeerId] = useState("");
  useEffect(() => {}, [
    fetch(`${ipfsApiUrl}/id`)
      .then(res => res.json())
      .then(data => setPeerId(data.ID))
  ]);

  // Activate the copy functionality
  useEffect(() => {
    new ClipboardJS(".copy-input-copy");
  }, []);

  let peerMultiAddress;
  if (peerId && (staticIp || domain)) {
    const origin = staticIp ? `/ip4/${staticIp}` : `/dns4/${domain}`;
    peerMultiAddress = `${origin}/tcp/4001/ipfs/${peerId}`;
  }

  // http://my.dappnode/#/system/add-ipfs-peer/%2Fip4%2F1.9.207.246%2Ftcp%2F4001%2Fipfs%2FQmQnwHU6nj1v47mZQWeej4rBtYYTPrMJft88vKp9BAV38L
  const addMyPeerUrl = `http://my.dappnode/#${systemRootPath}/${addIpfsPeerPath}/${encodeURIComponent(
    peerMultiAddress
  )}`;
  return (
    <>
      <SubTitle>Connect with peers</SubTitle>
      <Card>
        <div className="help-text" style={{ marginBottom: "1rem" }}>
          Share this link with another DAppNode admin to automatically
          peer-connect your two IPFS nodes. Use this resource to mitigate slow
          IPFS propagation
        </div>

        <Input
          disabled={true}
          value={addMyPeerUrl || ""}
          className="copy-input"
          append={
            <Button
              className="copy-input-copy"
              data-clipboard-text={addMyPeerUrl}
            >
              <GoClippy />
            </Button>
          }
        />
      </Card>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  dappnodeParams: getDappnodeParams
});

// withLoading is applied at DevicesRoot
export default connect(mapStateToProps)(IpfsDnpDappnodeEth);
