import { Navigate, useBlocker, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/game.context'
import StyleSheet from './Spajalica.module.css'
import { useEffect, useState, type ReactNode } from 'react';
import loadTranslation from '../../assets/locales/translationLoader';
import { useLocale } from '../../context/locale.context';
import { Dialogs } from 'bv-react-async-dialogs';
import { usePlayed } from '../../context/played.context';
import { usePoints } from '../../context/points.context';

interface TileProps {
  index: number,
  content: string,
  className?: string,
  disabled: boolean
  onClick?: (index: number) => void;
  onContextMenu: (text: string) => void; 
}

const MAX_TIME = 90;

export default function Spajalica() {
  const { game } = useGame();
  const navigate = useNavigate();

  if(!game) return <Navigate to={'/slagalica-build'} replace={true} />

  const correctPairs: Set<string> = new Set();
  const [intervalID, setIntervalID] = useState<number>();
  const [shouldBlock, setShouldBlock] = useState<boolean>(true);
  const [bonus, setBonus] = useState<number>(0);
  const { locale } = useLocale();
  const { played, setPlayed } = usePlayed();
  const { points, setPoints } = usePoints();
  const blocker = useBlocker(shouldBlock);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(MAX_TIME);
  const [leftTiles, setLeftTiles] = useState<TileProps[]>(game.spajalica.left.map((item, index) => {
    return {
      index,
      content: item,
      disabled: true
    } as TileProps
  }));
  const [rightTiles, setRightTiles] = useState<TileProps[]>(game.spajalica.right.map((item, index) => {
    return {
      index,
      content: item,
      disabled: false
    } as TileProps
  }));
  const text: any = loadTranslation(locale, 'spajalica');
  const blockerDialogText: any = loadTranslation(locale, 'blockerDialog');
  const gameOver = async () => {
    clearInterval(intervalID);
    const correct = leftTiles.filter(item => item.className === StyleSheet.correct).length;
    const pts = correct * 4;
    
    const title = text.dialogTitle;
    const pairsLeft = game.spajalica.pairs.filter(item => !correctPairs.has(item));
    let message = (text.dialogMessage as string).replace('${earnedPoints}', pts.toString()).replace('${bonus}', pts > 0 ? bonus.toString() : '0');

    message += '<ul>';
    pairsLeft.forEach(item => message += `<li>${item}</li>`)
    message += '</ul>'

    await Dialogs.alert({
      title,
      message,
      className: 'asyncDialog'
    });
    setShouldBlock(false);
    setPoints({...points, spajalica: pts > 0 ? pts +  bonus : 0});
    setPlayed({...played, spajalica: true});
    navigate(-1);
  }
  const handleTileChoice = (index: number) => {
    const newLeftTiles = [...leftTiles];
    const newRightTiles = [...rightTiles];
    const l = game.spajalica.left[currentItem];
    const  r = game.spajalica.right[index];
    const pair = `${l}-${r}`;
    const pairIndex = game.spajalica.pairs.indexOf(pair);
    if(pairIndex > -1) {
      correctPairs.add(game.spajalica.pairs[pairIndex]);
      newLeftTiles[currentItem].className = StyleSheet.correct;
      newRightTiles[index].className = StyleSheet.correct;
      newRightTiles[index].disabled = true;
    } else {
      newLeftTiles[currentItem].className = StyleSheet.wrong;
    }

    setLeftTiles(newLeftTiles);
    setRightTiles(newRightTiles);
    setCurrentItem(prev => {
      const next = prev + 1;
      
      if(next > 6) {
        gameOver();
      }

      return next;
    });
  }
  const showHiddenText = async (text: string) => {
    await Dialogs.alert({
      title: locale === 'sr' ? "Skriveni tekst" : "Hidden text",
      message: text,
      className: "asyncDialog"
    })
  }
  const generateTiles = () => {
    const tiles: ReactNode[] = [];
    
    for(let i = 0, l = game.spajalica.pairs.length; i < l; i++) {
      const marker = currentItem === i ? StyleSheet.currentItem : undefined;
      const className = `${leftTiles[i].className} ${marker}`

      tiles.push(<Tile key={`left-${i}`} {...leftTiles[i]} className={className} onContextMenu={showHiddenText} />)
      tiles.push(<Tile key={`right-${i}`} {...rightTiles[i]} onClick={handleTileChoice} onContextMenu={showHiddenText} />)
    }

    return tiles;
  }
  useEffect(() => {
    let intervalId = 0;

    if(blocker.state === 'blocked') {
      Dialogs.confirm({
        title: blockerDialogText.title,
        message: blockerDialogText.message,
        okText: blockerDialogText.okText,
        cancelText: blockerDialogText.cancelText,
        className: 'asyncDialog'
      }).then((confirmed: boolean) => {
        if (confirmed) {
          setPlayed({...played, spajalica: true})
          blocker.proceed(); // Proceed with navigation
        } else {
          blocker.reset(); // Stay on the current page
        }
      });
    }
    document.title = "Slagalica Kviz - Spajalica"
    intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          const currentOpenDialog = document.querySelector(".asyncDialog") as HTMLDialogElement;
          if(currentOpenDialog) currentOpenDialog.remove();
          clearInterval(intervalId);
          gameOver();
          return 0;
        }
        else if (blocker.state === 'blocked') return prev;

        // calculating bonus points
        const b = Math.floor((prev - 1) / 90 * 6)
        setBonus(b <= 4 ? b : 4)
        return prev - 1;
      });
    }, 1000);
    

    // Store the interval ID if you still want to save it
    setIntervalID(intervalId);

    // Clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [blocker]);
  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.timeCounter}>{timeLeft}</div>
      <div className={StyleSheet.gridWrapper}>
        <div className={StyleSheet.descriptionWrapper} onContextMenu={(event) => {
          event.preventDefault();
          showHiddenText(game.spajalica.description);
        }}>
          <span>{ game.spajalica.description }</span>
        </div>
        { generateTiles() }
      </div>
    </div>
  )
}

const Tile = ({index, content, className, onClick, onContextMenu, disabled }: TileProps) => {
  return <button
    className={`${StyleSheet.tile} ${className}`}
    onClick={() => {
      if(onClick) onClick(index)
    }}
    disabled={disabled}
    onContextMenu={(event) => {
      event.preventDefault();
      onContextMenu(content);
    }}
  >
    {content}
  </button>
}