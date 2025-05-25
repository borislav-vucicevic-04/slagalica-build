import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import StyleSheet from './Slagalica.module.css'
import { useGame } from '../../context/game.context'
import { usePoints } from '../../context/points.context'
import { useLocale } from '../../context/locale.context'
import loadTranslation from '../../assets/locales/translationLoader'
import useDialogBlocker from '../../utils/useDialogBlocker.utils'
import { Dialogs } from 'bv-react-async-dialogs'

export default function Slagalica() {
  const { game } = useGame();

  if(!game) return <Navigate to={'/'} replace={true} />
  
  const { locale } = useLocale();
  const { points, setPoints } = usePoints();
  const [shouldBlock, setShouldBlock] = useState<boolean>(true);
  const [intervalID, setIntervalID] = useState<number>();
  const [letters, setLetters] = useState<string[]>(game.slagalica.letters);
  const [chosenLetters, setChosenLetters] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const text: any = loadTranslation(locale, 'slagalica');
  const navigate = useNavigate();

  useDialogBlocker(shouldBlock)

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
    localStorage.setItem("shouldProceed", JSON.stringify(true));
    setShouldBlock(false);
    setPoints({...points, slagalica: pts})
    navigate('/slagalica-build/control-panel', { replace: true });
  }
  useEffect(() => {
    console.log(game.slagalica);
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(intervalId);
          handleSubmitWord();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Store the interval ID if you still want to save it
    setIntervalID(intervalId);

    // Clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.timeCounter}>{timeLeft}</div>
      <div className={StyleSheet.letterBtnsWrappers}>{
        letters.map((item, index) => <button className={StyleSheet.letterBtn} key={`lettter-${index}`} onClick={() => handleChooseLetter(item, index)}>{item}</button>)
      }</div>
      <div className={StyleSheet.userWordWrapper}>
        <span>{chosenLetters.join('')}</span>
        <button onClick={handleRemoveLetter}>{'\u232b'}</button>
      </div>
      <button className={StyleSheet.submitBtn} onClick={handleSubmitWord}>{text.submitBtn}</button>
    </div>
  )
}
