import { useCallback, useContext, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useEventListener, useUnmountEffect } from "primereact/hooks";
import { classNames } from "primereact/utils";
import { useSelector } from "react-redux";
import { LayoutContext } from "../../context/layoutcontent";
import AppSidebar from "../AppSidebar/AppSidebar";
import AppTopbar from "../AppTopbar";

function HomeLayout() {
  const location = useLocation();
  const { layoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);
  const topbarRef = useRef(null);
  const sidebarRef = useRef(null);
  const islogout = useSelector((state) => state.auth.logout);
  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
    useEventListener({
      type: "click",
      listener: (event) => {
        const isOutsideClicked = !(
          sidebarRef.current?.isSameNode(event.target) ||
          sidebarRef.current?.contains(event.target) ||
          topbarRef.current?.menubutton?.isSameNode(event.target) ||
          topbarRef.current?.menubutton?.contains(event.target)
        );

        if (isOutsideClicked) {
          hideMenu();
        }
      },
    });

  const [
    bindProfileMenuOutsideClickListener,
    unbindProfileMenuOutsideClickListener,
  ] = useEventListener({
    type: "click",
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current?.topbarmenu?.isSameNode(event.target) ||
        topbarRef.current?.topbarmenu?.contains(event.target) ||
        topbarRef.current?.topbarmenubutton?.isSameNode(event.target) ||
        topbarRef.current?.topbarmenubutton?.contains(event.target)
      );

      if (isOutsideClicked) {
        hideProfileMenu();
      }
    },
  });

  const hideMenu = useCallback(() => {
    setLayoutState((prev) => ({
      ...prev,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    unbindMenuOutsideClickListener();
    unblockBodyScroll();
  }, [setLayoutState, unbindMenuOutsideClickListener]);

  const hideProfileMenu = useCallback(() => {
    setLayoutState((prev) => ({
      ...prev,
      profileSidebarVisible: false,
    }));
    unbindProfileMenuOutsideClickListener();
  }, [setLayoutState, unbindProfileMenuOutsideClickListener]);

  useEffect(() => {
    hideMenu();
    hideProfileMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const blockBodyScroll = () => {
    if (document.body.classList) {
      document.body.classList.add("blocked-scroll");
    } else {
      document.body.className += " blocked-scroll";
    }
  };

  const unblockBodyScroll = () => {
    if (document.body.classList) {
      document.body.classList.remove("blocked-scroll");
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          "(^|\\b)" + "blocked-scroll".split(" ").join("|") + "(\\b|$)",
          "gi",
        ),
        " ",
      );
    }
  };

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener();
    }

    layoutState.staticMenuMobileActive && blockBodyScroll();
  }, [
    layoutState.overlayMenuActive,
    layoutState.staticMenuMobileActive,
    bindMenuOutsideClickListener,
  ]);

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener();
    }
  }, [layoutState.profileSidebarVisible, bindProfileMenuOutsideClickListener]);

  useUnmountEffect(() => {
    unbindMenuOutsideClickListener();
    unbindProfileMenuOutsideClickListener();
  });

  const containerClass = classNames("layout-wrapper", {
    "layout-overlay": layoutConfig.menuMode === "overlay",
    "layout-static": layoutConfig.menuMode === "static",
    "layout-static-inactive":
      layoutState.staticMenuDesktopInactive &&
      layoutConfig.menuMode === "static",
    "layout-overlay-active": layoutState.overlayMenuActive,
    "layout-mobile-active": layoutState.staticMenuMobileActive,
    "p-input-filled": layoutConfig.inputStyle === "filled",
    "p-ripple-disabled": !layoutConfig.ripple,
  });

  return (
    <div className={containerClass}>
      <div ref={sidebarRef} className="layout-sidebar">
        <AppSidebar />
      </div>

      <div className="layout-main-container">
        <div className="layout-main">
          <AppTopbar ref={topbarRef} />

          <Outlet />
        </div>

        <footer className="py-6 px-6 border-t border-slate-100 flex items-center justify-center mt-auto bg-white/50">
          <p className="text-xs font-medium text-slate-400 text-center">
           @ Developed by <a href="https://www.horizontechserv.in/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-600 transition-colors font-bold">Horizon Tech Serv</a>
          </p>
        </footer>
      </div>

      <div className="layout-mask"></div>
    </div>
  );
}

export default HomeLayout;

