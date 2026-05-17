import { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');

  return (
    <FilterContext.Provider value={{ status, setStatus, sort, setSort }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilter = () => useContext(FilterContext);
