import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react';

type LocaleType = 'sr' | 'en';
type LocaleContextType = {
  locale: LocaleType,
  setLocale: (value: LocaleType) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export const LocaleProvider = ({children}: {children: ReactNode}) => {
  const [locale, setLocale] = useState<LocaleType>('sr');

  return <LocaleContext.Provider value={{locale, setLocale}}>
    {children}
  </LocaleContext.Provider>
}

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if(!context) throw new Error("useContaxt mora biti korišten unutar LocaleProvider-a!");
  return context
}