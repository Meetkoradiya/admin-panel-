// Import Dependencies
import PropTypes from "prop-types";
import { Fragment, useEffect } from "react";

// Local Imports
import { APP_NAME } from "../../constants/app.constant";

// ----------------------------------------------------------------------

const Page = ({ title = "", children }) => {
  useEffect(() => {
    document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;
  }, [title]);

  return (
    <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-5 lg:p-6 animate-fade-in">
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  component: PropTypes.elementType,
};

export { Page };
