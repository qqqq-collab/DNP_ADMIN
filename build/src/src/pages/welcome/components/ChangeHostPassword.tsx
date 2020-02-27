import React, { useState, useEffect } from "react";
import * as api from "API/calls";
// Components
import Input from "components/Input";
import Button from "components/Button";
import Switch from "components/Switch";
import circuitBoardSvg from "illustrations/circuit_board-slim.svg";
import { ErrorFeedback } from "components/PasswordForm";

/**
 * View to chose or change the Eth multi-client
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
export default function ChangeHostPassword({
  onNext,
  onBack
}: {
  onBack?: () => void;
  onNext: () => void;
}) {
  const [input, setInput] = useState("");
  const [confirmInput, setConfirmInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const errors = [];
  if (input && input.length < 8)
    errors.push("Password must be at least 8 characters long");
  if (input.includes("'")) errors.push("Password MUST not include the quotes");
  if (!/^([\x20-\x7F])*$/.test(input))
    errors.push("Password must include only simple ASCII characters");

  const errorsConfirm = [];
  if (confirmInput && confirmInput !== input)
    errorsConfirm.push("Passwords do not match");

  const invalid =
    !input || !confirmInput || errors.length > 0 || errorsConfirm.length > 0;

  async function update() {
    if (invalid) return;

    // Move ahead
    onNext();

    // Change password in the background and don't stop for errors
    // The user can change the password latter again if it failed
    try {
      await api.passwordChange({ newPassword: input }).catch(e => {});
    } catch (e) {
      console.error(`Error changing host password in welcome flow`, e);
    }
  }

  return (
    <>
      <div className="illustration">
        <img src={circuitBoardSvg} />
      </div>

      <div className="header">
        <div className="title">Change host user password</div>
        <div className="description">
          Please change the host user password. The current password is the
          factory insecure default. Changing it to a strong password will
          protect your DAppNode from external attackers.
        </div>
      </div>

      <div className="change-password-form">
        <div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="password..."
            value={input}
            onValueChange={setInput}
            onEnterPress={update}
            isInvalid={errors.length > 0}
          />
          <ErrorFeedback errors={errors} />
        </div>

        <div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="confirm password..."
            value={confirmInput}
            onValueChange={setConfirmInput}
            onEnterPress={update}
            isInvalid={errorsConfirm.length > 0}
          />
          <ErrorFeedback errors={errorsConfirm} />
        </div>

        <span className="separator" />
        <div className="toggle">
          <Switch
            checked={showPassword}
            onToggle={() => setShowPassword(_show => !_show)}
            label={"Show my password"}
            id={"switch-password-visibility"}
          />
        </div>
      </div>

      <div className="bottom-buttons">
        {onBack && (
          <Button onClick={onBack} variant="outline-secondary">
            Back
          </Button>
        )}
        {invalid ? (
          <Button onClick={onNext} variant="outline-secondary">
            Skip
          </Button>
        ) : (
          <Button onClick={update} variant="dappnode">
            Next
          </Button>
        )}
      </div>
    </>
  );
}