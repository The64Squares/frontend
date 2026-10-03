import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { AlertProvider } from "./context/AlertContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import store from "./store";
import App from "./App";
import { HashRouter } from "react-router-dom";

const theme = createTheme();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AlertProvider>
            <App />
          </AlertProvider>
        </Provider>
      </ThemeProvider>
    </HashRouter>
  </>
);
