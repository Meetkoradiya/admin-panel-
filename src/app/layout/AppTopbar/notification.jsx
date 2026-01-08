import React from "react";
import { Icons } from "../../../constants/icons.constant";

export const Notification = () => {
  const Icon = Icons.notification;
  return (
    <div>
      <button className="p-link layout-topbar-button">
        <Icon className="size-7" />
      </button>
    </div>
  );
};
