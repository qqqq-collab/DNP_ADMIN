import React from "react";
import api from "API/rpcMethods";
import { confirm } from "components/ConfirmDialog";
// Components
import Card from "components/Card";
import Columns from "components/Columns";
import Button from "components/Button";

function PowerManagment() {
  function reboot() {
    confirm({
      title: `Rebooting host`,
      text: `Are you sure you want to reboot the host machine? Only do this if it’s strictly necessary.`,
      label: "Reboot",
      onClick: () => api.rebootHost({}, { toastMessage: `Rebooting host...` }),
      variant: "danger"
    });
  }

  async function powerOff() {
    // Since there are two consecutive modals, the async form must be used
    await new Promise(resolve =>
      confirm({
        title: `Powering off host`,
        text: `WARNING! Your machine will power off and you will not be able to turn it back on without physical access or a remote way to switch on the power.`,
        label: "Power off",
        onClick: resolve,
        variant: "danger"
      })
    );

    await new Promise(resolve =>
      confirm({
        title: `Are you sure?`,
        text: `Please make sure you have a way of turning the host machine’s power back on.`,
        label: "I am sure, power off",
        onClick: resolve,
        variant: "danger"
      })
    );

    await api.poweroffHost({}, { toastMessage: `Powering off down host...` });
  }

  return (
    <Card className="backup">
      {/* Get backup */}
      <Columns>
        <div>
          <div className="subtle-header">REBOOT HOST</div>
          <p>
            Only use this functionality as last resort and when all other
            troubleshooting options have been exhausted.
          </p>
          <Button
            onClick={reboot}
            // disabled={isOnProgress}
            variant="outline-danger"
          >
            Reboot
          </Button>
        </div>

        {/* Restore backup */}
        <div>
          <div className="subtle-header">POWER OFF HOST</div>
          <p>
            Your machine will power off and you will not be able to access the
            Admin UI until you turn it back on.
          </p>
          <Button
            onClick={powerOff}
            // disabled={isOnProgress}
            variant="outline-danger"
          >
            Power off
          </Button>
        </div>
      </Columns>
    </Card>
  );
}

export default PowerManagment;
