import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react';
import type IPoints from '../interfaces/points.interface';

type PointsContextType = {
  points: IPoints,
  setPoints: (value: IPoints) => void
}

const PointsContext = createContext<PointsContextType | undefined>(undefined)

export const PointsProvider = ({children}: {children: ReactNode}) => {
  const [points, setPoints] = useState<IPoints>({
    slagalica: null,
    mojBroj: null,
    spajalica: null,
    parovi: null,
    desnoLijevo: null,
    sef: null,
    zid: null,
    putOkoSvijeta: null,
    asocijacije: null,
    skriveneStaze: null,
    premetaljka: null,
    muzickaLicitacija: null
  });

  return <PointsContext.Provider value={{points, setPoints}}>
    {children}
  </PointsContext.Provider>
}

export const usePoints = () => {
  const context = useContext(PointsContext);
  if(!context) throw new Error("useContaxt mora biti korišten unutar PointsProvider-a!");
  return context
}