import PropTypes from 'prop-types';
import React, { useMemo, useState, useContext, createContext } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      openMenu,
      toggleMenu,
    }),
    [openMenu]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

DashboardProvider.propTypes = {
  children: PropTypes.element,
};

export const useDashboardContext = () => useContext(DashboardContext);
