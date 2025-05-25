import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react';
import type IPlayed from '../interfaces/played.interface';

type PlayedContextType = {
  played: IPlayed,
  setPlayed: (value: IPlayed) => void
}

const PlayedContext = createContext<PlayedContextType | undefined>(undefined)

export const PlayedProvider = ({children}: {children: ReactNode}) => {
  const [played, setPlayed] = useState<IPlayed>({
    slagalica: false,
    mojBroj: false,
    spajalica: false,
    parovi: false,
    desnoLijevo: false,
    sef: false,
    zid: false,
    putOkoSvijeta: false,
    asocijacije: false,
    skriveneStaze: false,
    premetaljka: false,
    licitacija: false
  });

  return <PlayedContext.Provider value={{played, setPlayed}}>
    {children}
  </PlayedContext.Provider>
}

export const usePlayed = () => {
  const context = useContext(PlayedContext);
  if(!context) throw new Error("useContaxt mora biti korišten unutar PlayedProvider-a!");
  return context
}