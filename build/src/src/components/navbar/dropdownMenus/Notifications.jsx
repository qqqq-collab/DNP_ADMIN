import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import { getNotifications } from "services/notifications/selectors";
import { viewedNotifications } from "services/notifications/actions";
// Icons
import Bell from "Icons/Bell";

const Notifications = ({ notifications, viewedNotifications }) => {
  return (
    <BaseDropdown
      name="Notifications"
      messages={notifications}
      Icon={Bell}
      onClick={viewedNotifications}
      moreVisible={true}
      className={"notifications"}
      placeholder="No notifications yet"
    />
  );
};

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  viewedNotifications: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  notifications: getNotifications
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { viewedNotifications };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
