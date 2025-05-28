import { useEffect, useState } from 'react'
import { Navigate, useBlocker, useNavigate } from 'react-router-dom'
import StyleSheet from './Slagalica.module.css'
import { useGame } from '../../context/game.context'
import { usePoints } from '../../context/points.context'
import { useLocale } from '../../context/locale.context'
import loadTranslation from '../../assets/locales/translationLoader'
import { Dialogs } from 'bv-react-async-dialogs'
import { usePlayed } from '../../context/played.context'

export default function Slagalica() {
  const { game } = useGame();
  const { played, setPlayed } = usePlayed()
  const navigate = useNavigate();
  
  const { locale } = useLocale();

  if(!game) return <Navigate to={'/slagalica-build'} replace={true} />
  const { points, setPoints } = usePoints();
  const [shouldBlock, setShouldBlock] = useState<boolean>(true);
  const [intervalID, setIntervalID] = useState<number>();
  const [letters, setLetters] = useState<string[]>(game.slagalica.letters);
  const [chosenLetters, setChosenLetters] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const text: any = loadTranslation(locale, 'slagalica');
  const blockerDialogText: any = loadTranslation(locale, 'blockerDialog');

  // navigation blocker
  const blocker = useBlocker(shouldBlock && !played.slagalica);

  const handleChooseLetter = (letter: string, index: number) => {
    const newLetters = [...letters];
    const newChosenLetters = [...chosenLetters, letter];

    newLetters.splice(index, 1);

    setLetters(newLetters);
    setChosenLetters(newChosenLetters);
  }
  const handleRemoveLetter = () => {
    if(letters.length >= 12) return;

    const newLetters = [...letters, chosenLetters[chosenLetters.length - 1]];
    const newChosenLetters = chosenLetters.slice(0, -1);

    setLetters(newLetters);
    setChosenLetters(newChosenLetters);
  }
  const handleSubmitWord = async () => {
    clearInterval(intervalID);

    const userWord = chosenLetters.join('');
    let pts = 0;
    let title = '';
    let message = '';
    
    if(game.slagalica.wordLibrary.includes(userWord)) {

      if(userWord.length >= game.slagalica.computerWord.length) pts += 6;

      pts += userWord.length * 2;
      title = text.winDialogTitle;
      message = (text.winDialogMessage as string).replace('${computerWord}', game.slagalica.computerWord).replace('${earnedPoints}', pts.toString());

    } else {
      title = text.defeatDialogTitle;
      message = (text.defeatDialogMessage as string).replace('${computerWord}', game.slagalica.computerWord)
    }
    await Dialogs.alert({
      title,
      message,
      className: 'asyncDialog'
    });
    setShouldBlock(false);
    setPoints({...points, slagalica: pts});
    setPlayed({...played, slagalica: true});
    navigate(-1);
  }
  const confirmSubmitWord = async () => {
    const confirmation = await Dialogs.confirm({
      title: text.confirmTitle,
      message: text.confirmMessage,
      className: 'asyncDialog',
      okText: text.confirmOK,
      cancelText: text.confirmCancel,
    });

    if(confirmation) handleSubmitWord();
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
          setPlayed({...played, slagalica: true})
          blocker.proceed(); // Proceed with navigation
        } else {
          blocker.reset(); // Stay on the current page
        }
      });
    }
    document.title = "Slagalica Kviz - Slagalica"
    intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          const currentOpenDialog = document.querySelector(".asyncDialog") as HTMLDialogElement;
          if(currentOpenDialog) currentOpenDialog.remove();
          clearInterval(intervalId);
          handleSubmitWord();
          return 0;
        }
        else if (blocker.state === 'blocked') return prev;
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

  return !played.slagalica ? (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.timeCounter}>{timeLeft}</div>
      <div className={StyleSheet.letterBtnsWrappers}>{
        letters.map((item, index) => <button className={StyleSheet.letterBtn} key={`lettter-${index}`} onClick={() => handleChooseLetter(item, index)}>{item}</button>)
      }</div>
      <div className={StyleSheet.userWordWrapper}>
        <span>{chosenLetters.join('')}</span>
        <button onClick={handleRemoveLetter}>{'\u232b'}</button>
      </div>
      <button className={StyleSheet.submitBtn} onClick={confirmSubmitWord}>{text.submitBtn}</button>
    </div>
  ) : locale === 'sr' ? 'Već ste odigrali ovu igru' : 'You already have played this game';
}
