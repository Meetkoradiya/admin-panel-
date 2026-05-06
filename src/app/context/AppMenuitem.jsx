import React, { useEffect, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import { CSSTransition } from "react-transition-group";
import { MenuContext } from "./menucontext";
import { LayoutContext } from "./layoutcontent";
import { Link, useLocation } from "react-router-dom";

const AppMenuitem = (props) => {
  const location = useLocation();
  const { activeMenu, setActiveMenu } = useContext(MenuContext);
  const { layoutState, onMenuToggle } = useContext(LayoutContext);
  const item = props.item;
  const Icon = item?.Icon;
  const submenuRef = useRef(null);
  const itemRef = useRef(null);
  const key = props.parentKey
    ? props.parentKey + "-" + props.index
    : String(props.index);
  const isActiveRoute = item?.to && location.pathname === item.to;
  const active = activeMenu === key || activeMenu.startsWith(key + "-");

  // Flyout popup state for mini sidebar
  const [showPopup, setShowPopup] = useState(false);
  const [popupTop, setPopupTop] = useState(0);
  const timeoutRef = useRef(null);

  const isMiniMode = layoutState.staticMenuDesktopInactive;

  const onMouseEnter = () => {
    if (isMiniMode && item?.items && !props.root) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const rect = itemRef.current?.getBoundingClientRect();
      setPopupTop(rect?.top ?? 0);
      setShowPopup(true);
    }
  };

  const onMouseLeave = () => {
    if (isMiniMode && item?.items && !props.root) {
      timeoutRef.current = setTimeout(() => {
        setShowPopup(false);
      }, 100);
    }
  };

  const onRouteChange = (url) => {
    if (item?.to && item.to === url) {
      setActiveMenu(key);
    }
  };

  useEffect(() => {
    onRouteChange(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Close popup when route changes
  useEffect(() => {
    setShowPopup(false);
  }, [location.pathname]);

  // Close popup on outside click
  useEffect(() => {
    if (!showPopup) return;
    const handleOutside = (e) => {
      if (itemRef.current && !itemRef.current.contains(e.target)) {
        // Also allow clicks inside the popup portal
        const popup = document.querySelector(".mini-sidebar-popup");
        if (popup && popup.contains(e.target)) return;
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showPopup]);

  const itemClick = (event) => {
    //avoid processing disabled items
    if (item?.disabled) {
      event.preventDefault();
      return;
    }

    //execute command
    if (item?.command) {
      item?.command({ originalEvent: event, item: item });
    }

    // If mini mode and item has sub-items → show flyout popup
    if (item?.items && isMiniMode && !props.root) {
      event.preventDefault();
      const rect = itemRef.current?.getBoundingClientRect();
      setPopupTop(rect?.top ?? 0);
      setShowPopup((prev) => !prev);
      return;
    }

    // toggle active state
    if (item?.items) {
      setActiveMenu(active ? props.parentKey : key);
    } else {
      setActiveMenu(key);
    }
  };

  const subMenu = item?.items && item?.visible !== false && (
    <CSSTransition
      nodeRef={submenuRef}
      timeout={{ enter: 1000, exit: 450 }}
      classNames="layout-submenu"
      in={props.root ? true : active}
      key={item?.label}
    >
      <ul ref={submenuRef}>
        {item?.items.map((child, i) => {
          return (
            <AppMenuitem
              item={child}
              index={i}
              className={child.badgeClass}
              parentKey={key}
              key={child.label}
            />
          );
        })}
      </ul>
    </CSSTransition>
  );

  // Flyout popup rendered via portal (so it's not clipped by sidebar overflow)
  const flyoutPopup =
    showPopup &&
    isMiniMode &&
    item?.items &&
    createPortal(
      <div
        className="mini-sidebar-popup"
        style={{ top: popupTop, left: 82 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="mini-sidebar-popup-title">{item.label}</div>
        {item.items.map((child, i) => {
          const isChildActive = child.to && location.pathname === child.to;
          return (
            <Link
              key={i}
              to={child.to || "#"}
              className={classNames("mini-sidebar-popup-item", {
                "active-route": isChildActive,
              })}
              onClick={() => {
                setShowPopup(false);
                setActiveMenu(key + "-" + i);
              }}
            >
              {child.icon && (
                <i className={classNames("mini-sidebar-popup-icon", child.icon)} />
              )}
              <span>{child.label}</span>
            </Link>
          );
        })}
      </div>,
      document.body
    );

  return (
    <li
      ref={itemRef}
      className={classNames({
        "layout-root-menuitem": props.root,
        "active-menuitem": active,
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {props.root && item?.visible !== false && (
        <div className="layout-menuitem-root-text">{item?.label}</div>
      )}
      {(!item?.to || item?.items) && item?.visible !== false ? (
        <a
          href={item?.url}
          onClick={(e) => itemClick(e)}
          className={classNames(item?.class, "p-ripple", {
            "mini-active": showPopup && isMiniMode,
          })}
          target={item?.target}
          tabIndex={0}
        >
          {Icon ? (
            <Icon className="layout-menuitem-icon size-2" />
          ) : item?.icon ? (
            <i className={classNames("layout-menuitem-icon", item.icon)} />
          ) : null}

          <span className="layout-menuitem-text">{item?.label}</span>
          {item?.items && (
            <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
          )}
          <Ripple />
        </a>
      ) : null}

      {item?.to && !item?.items && item?.visible !== false ? (
        <Link
          to={item?.to}
          replace={item?.replaceUrl}
          target={item?.target}
          onClick={(e) => itemClick(e)}
          className={classNames(item?.class, "p-ripple", {
            "active-route": isActiveRoute,
          })}
          tabIndex={0}
        >
          {Icon ? (
            <Icon className="layout-menuitem-icon size-2" />
          ) : item?.icon ? (
            <i className={classNames("layout-menuitem-icon", item.icon)} />
          ) : null}
          <span className="layout-menuitem-text">{item?.label}</span>
          {item?.items && (
            <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
          )}
          <Ripple />
        </Link>
      ) : null}

      {subMenu}
      {flyoutPopup}
    </li>
  );
};

export default AppMenuitem;
