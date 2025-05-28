import { useEffect, useState, type ReactNode } from 'react'
import StyleSheet from './Parovi.module.css'
import { Navigate, useBlocker, useNavigate } from 'react-router-dom'
import { useGame } from '../../context/game.context'
import { useLocale } from '../../context/locale.context'
import { usePlayed } from '../../context/played.context'
import { usePoints } from '../../context/points.context'

// cards
import Apple from './../../assets/imgs/parovi/apple.svg'
import CardBack from './../../assets/imgs/parovi/cardBack.svg'
import Cherries from './../../assets/imgs/parovi/cherries.svg'
import Clubs from './../../assets/imgs/parovi/clubs.svg'
import Diamonds from './../../assets/imgs/parovi/diamonds.svg'
import DiceOne from './../../assets/imgs/parovi/dice_one.svg'
import DiceSix from './../../assets/imgs/parovi/dice_six.svg'
import Gem from './../../assets/imgs/parovi/gem.svg'
import Heart from './../../assets/imgs/parovi/heart.svg'
import Lemon from './../../assets/imgs/parovi/lemon.svg'
import Plum from './../../assets/imgs/parovi/plum.svg'
import Seven from './../../assets/imgs/parovi/seven.svg'
import Spades from './../../assets/imgs/parovi/spades.svg'
import loadTranslation from '../../assets/locales/translationLoader'
import { Dialogs } from 'bv-react-async-dialogs'

interface FlipCardProps {
  index: number,
  cardName: string,
  className: string,
  front: ReactNode,
  back: ReactNode,
  isFlipped: boolean
  onclick: (index: number) => void
}

export default function Parovi() {
  const { game } = useGame();
  const navigate = useNavigate();
  
  if(!game) return <Navigate to={'/slagalica-build'} replace={true} />

  const [cards, setCards] = useState<FlipCardProps[]>(game.parovi.cards.map((item, index) => {
    let back: ReactNode = <p></p>;

    switch(item) {
      case 'apple': back = <img src={Apple} alt='apple' />; break;
      case 'cherries': back = <img src={Cherries} alt='cherries' />; break;
      case 'clubs': back = <img src={Clubs} alt='clubs' />; break;
      case 'diamonds': back = <img src={Diamonds} alt='diamonds' />; break;
      case 'diceOne': back = <img src={DiceOne} alt='dice - one dot' />; break;
      case 'diceSix': back = <img src={DiceSix} alt='dice - six dots' />; break;
      case 'gem': back = <img src={Gem} alt='gem' />; break;
      case 'heart': back = <img src={Heart} alt='heart' />; break;
      case 'lemon': back = <img src={Lemon} alt='lemon' />; break;
      case 'plum': back = <img src={Plum} alt='plum' />; break;
      case 'seven': back = <img src={Seven} alt='seven' />; break;
      case 'spades': back = <img src={Spades} alt='spades' />; break;
      default: break;
    }
    return {
      index,
      cardName: item,
      className: StyleSheet.flipCard,
      front: <img src={CardBack} alt='back side of the card' />,
      back,
      onclick: () => {},
      isFlipped: false
    }
  }));
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(18);
  const [chosenPair, setChosenPair] = useState<FlipCardProps[]>([]);
  const { locale } = useLocale();
  const { points, setPoints } = usePoints();
  const { played, setPlayed } = usePlayed();
  const text: any = loadTranslation(locale, 'parovi');
  const [shouldBlock, setShouldBlock] = useState<boolean>(true);
  const blocker = useBlocker(shouldBlock);
  const blockerDialogText: any = loadTranslation(locale, 'blockerDialog');
  
  const checkPair = () => {
    setIsBusy(true);
    const [first, second] = chosenPair;

    if (first.cardName === second.cardName) {
      setChosenPair([]);
      setIsBusy(false);

      // ✅ Check if all cards are flipped — game won
      const allFlipped = cards.every(card => card.isFlipped || card.cardName === first.cardName);
      if (allFlipped) {
        setTimeout(() => {
          gameOver()
        }, 500);
      }

    } else {
      setTimeout(() => {
        const newCards = cards.map((card, idx) => {
          if (idx === first.index || idx === second.index) {
            return { ...card, isFlipped: false };
          }
          return card;
        });

        setCards(newCards);
        setChosenPair([]);
        setMoves(prev => {
          const newMoves = prev - 1;

          // ❌ Check if moves are exhausted — game lost
          if (newMoves <= 0) {
            setTimeout(() => {
              gameOver();
            }, 1000);
          }

          return newMoves;
        });
        setIsBusy(false);
      }, 1000);
    }
  };

  const handleFlipCardClick = (index: number) => {
    if (isBusy) return;
    const newCards = [...cards];
    const chosen = {...newCards[index]};
    
    chosen.isFlipped = true;
    newCards.splice(index, 1, chosen);
    setCards(newCards);

    setChosenPair(prev => [...prev, chosen]);
  }
  
  const gameOver = () => {
    const pts = cards.filter(item => item.isFlipped).length;
    const bonus = cards.filter(item => !item.isFlipped).length === 0 ? moves : 0;
    
    if(bonus === 0) {
      setCards(prev => prev.map(item => { return {...item, isFlipped: true} }));
    }
    setTimeout(async () => {
      await Dialogs.alert({
        title: text.dialogTitle,
        message: text.dialogMessage.replace('${earnedPoints}', pts.toString()).replace('${bonus}', bonus.toString()),
        className: 'asyncDialog'
      });
      setShouldBlock(false);
      setPoints({...points, parovi: pts + bonus});
      setPlayed({...played, parovi: true});
      navigate(-1);

    }, 1500);
  }

  useEffect(() => {
    if(chosenPair.length === 2) checkPair();

    if(blocker.state === 'blocked') {
      Dialogs.confirm({
        title: blockerDialogText.title,
        message: blockerDialogText.message,
        okText: blockerDialogText.okText,
        cancelText: blockerDialogText.cancelText,
        className: 'asyncDialog'
      }).then((confirmed: boolean) => {
        if (confirmed) {
          setPlayed({...played, parovi: true})
          blocker.proceed(); // Proceed with navigation
        } else {
          blocker.reset(); // Stay on the current page
        }
      });
    }
  }, [chosenPair, blocker])

  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.movesCounter}>{ moves }</div>
      <div className={StyleSheet.gridWrapper}>{
        cards.map(item => <FlipCard key={item.index} {...item} onclick={handleFlipCardClick} />)
      }</div>
    </div>
  )
}

const FlipCard = ({index, className, front, back, isFlipped, onclick}: FlipCardProps) => {
  return <button className={className} onClick={() => onclick(index)} disabled={isFlipped}>
    <div className={StyleSheet.flipCardInner} style={{transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}>
      <div className={StyleSheet.flipCardFront}>{ front }</div>
      <div className={StyleSheet.flipCardBack}>{ back }</div>
    </div>
  </button>
}