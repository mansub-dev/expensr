import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
