import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react';
import type IGame from '../interfaces/game.interface';

type GameContextType = {
  game?: IGame,
  setGame: (value: IGame) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider = ({children}: {children: ReactNode}) => {
  const [game, setGame] = useState<IGame>();

  return <GameContext.Provider value={{game, setGame}}>
    {children}
  </GameContext.Provider>
}

export const useGame = () => {
  const context = useContext(GameContext);
  if(!context) throw new Error("useContaxt mora biti korišten unutar GameProvider-a!");
  return context
}