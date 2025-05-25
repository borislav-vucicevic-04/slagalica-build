import { createRoot } from 'react-dom/client'
import './index.css'
import { LocaleProvider } from './context/locale.context.tsx'
import { GameProvider } from './context/game.context.tsx'
import router from './router.tsx'
import { RouterProvider } from 'react-router-dom'
import { PointsProvider } from './context/points.context.tsx'
import { PlayedProvider } from './context/played.context.tsx'

createRoot(document.getElementById('root')!).render(
  <LocaleProvider>
    <GameProvider>
      <PointsProvider>
        <PlayedProvider>
          <RouterProvider router={router} />
        </PlayedProvider>
      </PointsProvider>
    </GameProvider>
  </LocaleProvider>
)
