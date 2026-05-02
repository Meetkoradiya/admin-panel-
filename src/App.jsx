import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";

import AutoRefreshToken from "./app/pages/auth/AutoRefreshToken";
import AppRoutes from "./app/router";


function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <ConfirmDialog />
      {isAuthenticated && <AutoRefreshToken />}

      <AppRoutes />
    </>
  );
}

export default App;
