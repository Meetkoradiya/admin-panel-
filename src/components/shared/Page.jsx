// Import Dependencies
import PropTypes from "prop-types";
import { Fragment, useEffect } from "react";

// Local Imports
import { APP_NAME } from "../../constants/app.constant";

// ----------------------------------------------------------------------

const Page = ({ title = "", component = Fragment, children }) => {
  const Component = component;

  useEffect(() => {
    document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;
  }, [title]);

  return <Component>{children}</Component>;
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  component: PropTypes.elementType,
};

export { Page };
