import { Navigate, useBlocker, useNavigate } from 'react-router-dom';
import StyleSheet from './DesnoLijevo.module.css'
import { useGame } from '../../context/game.context';
import { useEffect, useState, type ReactNode } from 'react';
import { useLocale } from '../../context/locale.context';
import { Dialogs } from 'bv-react-async-dialogs';
import { usePlayed } from '../../context/played.context';
import { usePoints } from '../../context/points.context';
import loadTranslation from '../../assets/locales/translationLoader';

interface TileProps {
  index: number,
  className?: string,
  content: string,
  disabled: boolean,
  handleChoice: (chosen: TileProps) => void,
  showHiddenText: (text: string) => void
}

const MAX_TIME = 60;

export default function DesnoLijevo() {
  const { game } = useGame();
  const navigate = useNavigate();
  
  
  if(!game) return <Navigate to={'/slagalica-build'} replace={true} />
  
  const { locale } = useLocale();
  const {played, setPlayed} = usePlayed();
  const {points, setPoints} = usePoints();
  const text: any = loadTranslation(locale, 'desnoLijevo');
  const blockerDialogText: any = loadTranslation(locale, 'blockerDialog');
  const [intervalID, setIntervalID] = useState<number>();
  const [timeLeft, setTimeLeft] = useState<number>(MAX_TIME);
  const [current, setCurrent] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0)
  const [shouldBlock, setShouldBlock] = useState<boolean>(true);
  const blocker = useBlocker(shouldBlock);
  const [tiles, setTiles] = useState<TileProps[][]>(game.desnoLijevo.pairs.map((item, index) => {
    const left: TileProps = {
      index,
      content: item[0],
      disabled: false,
      handleChoice: () => {},
      showHiddenText: () => {}
    }
    const right: TileProps = {
      index,
      content: item[1],
      disabled: false,
      handleChoice: () => {},
      showHiddenText: () => {}
    }

    return [left, right]
  }));
  const handleChoice = (chosen: TileProps) => {
    const left = {...tiles[chosen.index][0]};
    const right = {...tiles[chosen.index][1]};

    if(game.desnoLijevo.correct.includes(chosen.content)) {
      if(left.content === chosen.content) left.className = StyleSheet.correct;
      else right.className = StyleSheet.correct
    } else {
      if(left.content === chosen.content) left.className = StyleSheet.wrong;
      else right.className = StyleSheet.wrong
    }
    
    left.disabled = true;
    right.disabled = true;

    setTiles(prev => {
      const newTiles = [...prev];
      newTiles.splice(chosen.index, 1, [left, right]);
      return newTiles;
    });
    setCurrent(prev => prev + 1)
  }
  const showHiddenText = async (text: string) => {
    await Dialogs.alert({
      title: locale === 'sr' ? 'Skriveni tekst' : 'Hidden text',
      message: text,
      className: 'asyncDialog'
    })
  }
  const gameOver = async () => {
    clearInterval(intervalID);
    const pts = tiles.filter(item => item[0].className === StyleSheet.correct || item[1].className === StyleSheet.correct).length * 2;
    
    await Dialogs.alert({
      title: text.dialogTitle,
      message: (text.dialogMessage as string).replace('${earnedPoints}', pts.toString()).replace('${bonus}', bonus.toString()),
      className: 'asyncDialog'
    });

    setShouldBlock(false);
    setPoints({...points, desnoLijevo: pts > 0 ? pts +  bonus : 0});
    setPlayed({...played, desnoLijevo: true});
    navigate(-1);
  }
  const generateButtons = () => {
    const btns: ReactNode[] = [];

    for (const index in tiles) {
      if(Number(index) > current) break;

      const item = tiles[index];

      btns.push(<Tile key={`left-${index}`} {...item[0]} handleChoice={handleChoice} showHiddenText={showHiddenText} />);
      btns.push(<Tile key={`right-${index}`} {...item[1]} handleChoice={handleChoice} showHiddenText={showHiddenText} />);
    }

    return btns;
  }
  useEffect(() => {
    let intervalId = 0;
    if(current >= 7) {
      gameOver();
    }
    if(blocker.state === 'blocked') {
      Dialogs.confirm({
        title: blockerDialogText.title,
        message: blockerDialogText.message,
        okText: blockerDialogText.okText,
        cancelText: blockerDialogText.cancelText,
        className: 'asyncDialog'
      }).then((confirmed: boolean) => {
        if (confirmed) {
          setPlayed({...played, desnoLijevo: true})
          blocker.proceed(); // Proceed with navigation
        } else {
          blocker.reset(); // Stay on the current page
        }
      });
    }
    document.title = "Slagalica Kviz - Desno - Lijevo"
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
        const b = Math.floor((prev - 1) / MAX_TIME * 8)
        setBonus(b <= 6 ? b : 6)
        return prev - 1;
      });
    }, 1000);
    

    // Store the interval ID if you still want to save it
    setIntervalID(intervalId);

    // Clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [blocker, current]);
  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.timeCounter}>{timeLeft}</div>
      <div className={StyleSheet.gridWrapper}>
        <div className={StyleSheet.descriptionWrapper} onContextMenu={(event) => {
          event.preventDefault();
          showHiddenText(game.desnoLijevo.description);
        }}>
          <span>{ game.desnoLijevo.description }</span>
        </div>
        { generateButtons() }
      </div>
    </div>
  )
}
const Tile = ({index, content, className, handleChoice, disabled, showHiddenText}: TileProps) => {
  return <button 
    disabled={disabled}
    className={`${StyleSheet.tile} ${className}`}
    onClick={() => handleChoice({
      index,
      content,
      className,
      handleChoice,
      showHiddenText,
      disabled
    })}
    onContextMenu={(event) => {
      event.preventDefault();
      showHiddenText(content);
    }}
  >
    { content }
  </button>
}