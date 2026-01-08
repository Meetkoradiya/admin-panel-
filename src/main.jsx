import "./styles/App.css";
import App from "./App.jsx";
import "./styles/layout/layout.scss";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./redux/Store.jsx";
import { LayoutProvider } from "./app/context/layoutcontent.jsx";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <LayoutProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LayoutProvider>
  </Provider>,
);
