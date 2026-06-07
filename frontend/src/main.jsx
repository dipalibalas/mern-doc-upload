import ReactDOM from "react-dom/client";

import { HashRouter }
from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";

import "./index.css";

import {
  AuthProvider,
} from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

const queryClient =
  new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <HashRouter>
    <QueryClientProvider
      client={queryClient}
    >
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HashRouter>
);