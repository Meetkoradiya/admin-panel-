import React from "react";
import { Icons } from "@/constants/icons.constant";

export const Setting = () => {
  const Icon = Icons.settings;

  return (
    <div>
      <button className="p-link layout-topbar-button">
        <Icon className="size-6" />
      </button>
    </div>
  );
};
