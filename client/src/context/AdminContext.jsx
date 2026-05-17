import { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => !!localStorage.getItem('admin_key')
  );

  function login(key) {
    localStorage.setItem('admin_key', key);
    setIsAdmin(true);
  }

  function logout() {
    localStorage.removeItem('admin_key');
    setIsAdmin(false);
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
