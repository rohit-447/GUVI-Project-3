import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ type: "", message: "" });

  const showAlert = (type, message, timeout = 5000) => {
    setAlert({ type, message });

    if (timeout) {
      setTimeout(() => {
        clearAlert();
      }, timeout);
    }
  };

  const clearAlert = () => {
    setAlert({ type: "", message: "" });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
