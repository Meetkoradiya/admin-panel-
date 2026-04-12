import React from "react";
import { Link } from "react-router-dom";
import { classNames } from "primereact/utils";

const AppMenuIcon = ({ item, index }) => {
  const Icon = item?.Icon || item?.icon;
  
  // If the item has children but no direct link, we still might want to show its group icon if it has one
  // but if it has neither, there's nothing to click. Usually collapsed menus only show icons for clickable links.
  
  return (
    <li className="icon-menu-item flex items-center justify-center p-3 mb-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group relative" title={item.label}>
      {item.to ? (
        <Link to={item.to} className="p-ripple flex items-center justify-center w-full h-full">
          {typeof Icon === 'function' || typeof Icon === 'object' ? (
            <Icon className="size-6 text-slate-500 group-hover:text-indigo-600 transition-colors" />
          ) : Icon ? (
            <i className={classNames("text-xl text-slate-500 group-hover:text-indigo-600 transition-colors", Icon)} />
          ) : (
            <i className="pi pi-bars text-xl text-slate-500 group-hover:text-indigo-600" />
          )}
        </Link>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
           {typeof Icon === 'function' || typeof Icon === 'object' ? (
             <Icon className="size-6 text-slate-500 group-hover:text-indigo-600 transition-colors" />
           ) : Icon ? (
             <i className={classNames("text-xl text-slate-500 group-hover:text-indigo-600 transition-colors", Icon)} />
           ) : (
             <i className="pi pi-folder text-xl text-slate-500 group-hover:text-indigo-600" />
           )}
        </div>
      )}
    </li>
  );
};

export default AppMenuIcon;
