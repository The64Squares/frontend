import React, { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Alert.css";

const AlertContext = createContext();

export const positions = {
  BOTTOM_CENTER: "bottom-center",
  TOP_RIGHT: "top-right",
};

export const transitions = {
  SCALE: "scale",
  FADE: "fade",
};

export const AlertProvider = ({ children }) => {
  const alert = {
    show: (msg, options) => toast(msg, options),
    error: (msg, options) => toast.error(msg, options),
    success: (msg, options) => toast.success(msg, options),
    info: (msg, options) => toast.info(msg, options),
  };

  return (
    <AlertContext.Provider value={alert}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    return {
      show: (msg) => toast(msg),
      error: (msg) => toast.error(msg),
      success: (msg) => toast.success(msg),
      info: (msg) => toast.info(msg),
    };
  }
  return context;
};

export default AlertContext;
