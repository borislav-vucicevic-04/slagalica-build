import { useEffect, useState } from 'react';
import { Navigate, useBlocker, useNavigate } from 'react-router-dom';
import StyleSheet from './MojBroj.module.css'
import { Dialogs } from 'bv-react-async-dialogs';
import { useGame } from '../../context/game.context'
import { usePoints } from '../../context/points.context';
import { useLocale } from '../../context/locale.context';
import loadTranslation from '../../assets/locales/translationLoader';
import { usePlayed } from '../../context/played.context';

interface NumberBtnProps {
  index: number,
  content: number | string
  disabled: boolean,
  handleNumberChoice: (content: number) => void
}

export default function MojBroj() {
  const { game } = useGame();
  
  if(!game) return <Navigate to={'/slagalica-build'} replace={true} />

  const { locale } = useLocale();
  const { points, setPoints } = usePoints();
  const { played, setPlayed } = usePlayed();
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [intervalID, setIntervalID] = useState<number>();
  const [shouldBlock, setShouldBlock] = useState<boolean>(true);
  const [expressionParts, setExpressionParts] = useState<(number | string)[]>([]);
  const [numberBtns, setNumberBtns] = useState<NumberBtnProps[]>(
    game.mojBroj.givenNumbers.map((item, index) => {
      return {
        index,
        content: item,
        disabled: false,
        handleNumberChoice: () => {},
      }
    })
  );
  const text: any = loadTranslation(locale, 'mojBroj');
  const blockerDialogText: any = loadTranslation(locale, 'blockerDialog');
  const navigate = useNavigate();
  const blocker = useBlocker(shouldBlock);
  const handleNumberChoice = (index: number) => {
    const chosen = numberBtns[index];
    const newExpressionParts = [...expressionParts];
    const newNumberBtns = [...numberBtns]
    const lastPart = expressionParts[expressionParts.length - 1];

    if(typeof lastPart === 'number') return;

    newExpressionParts.push(chosen.index);
    chosen.disabled = true;
    newNumberBtns.splice(index, 1, chosen);

    setExpressionParts(newExpressionParts);
    setNumberBtns(newNumberBtns)
  }
  const handleOperatorChoice = (operator: string) => {
    setExpressionParts([...expressionParts, operator])
  }
  const handleBackSpace = () => {
    const newExpressionParts = [...expressionParts];
    const newNumberBtns = [...numberBtns];
    const removed = newExpressionParts.pop();

    if(typeof removed === 'number') {
      newNumberBtns[removed].disabled = false;
    }

    setExpressionParts(newExpressionParts);
    setNumberBtns(newNumberBtns)
  }
  const generateExpression = () => {
    const expression: string[] = expressionParts.map(item => {
      if(typeof item === 'number') return game.mojBroj.givenNumbers[item].toString();
      else return item;
    });

    return expression.join('');
  }
  const evaluateExpression = () => {
    let rs: number | string = '!?'
    try {
      rs = Number((eval(generateExpression()) as number).toFixed(2));
    } catch (error) {
      rs = '!?'
    } finally {
      return rs;
    }
  }
  const submit = async () => {
    clearInterval(intervalID);
    const result = Number(evaluateExpression());
    let pts = 0;
    let difference = 0;

    if(!isNaN(result)) {
      difference = Math.abs(result - game.mojBroj.wantedNumber);
      if(difference === 0) pts = 30;
      else if(difference <= 5) pts = 20;
      else if(difference <= 10) pts = 10;
      else if (difference <= 20) pts = 5;
      else pts = 0;
    }

    await Dialogs.alert({
      title: text.dialogTitle,
      message: text.dialogMessage.replace('${earnedPoints}', pts.toString()),
      className: 'asyncDialog',
    });

    setShouldBlock(false);
    setPoints({...points, mojBroj: pts})
    setPlayed({...played, mojBroj: true});
    navigate(-1);
  }
  const confirmSubmit = async () => {
    const confirmation = await Dialogs.confirm({
      title: text.confirmTitle,
      message: text.confirmMessage,
      className: 'asyncDialog',
      okText: text.confirmOK,
      cancelText: text.confirmCancel,
    });

    if(confirmation) submit();

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
            blocker.proceed(); // Proceed with navigation
          } else {
            blocker.reset(); // Stay on the current page
          }
        });
    }
    if(played.mojBroj) {
      console.log("Game has already been played!");
      setShouldBlock(false);
      navigate(-1);
    }
    else { 
      setPlayed({...played, mojBroj: true})
      document.title = "Slagalica Kviz - Moj broj"
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(intervalId);
            submit();
            return 0;
          }
          else if (blocker.state === 'blocked') return prev;
          return prev - 1;
        });
      }, 1000);
    }

    // Store the interval ID if you still want to save it
    setIntervalID(intervalId);

    // Clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [blocker])
  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.timeCounter}>{timeLeft}</div>
      <div className={StyleSheet.rowWrapper}>
        <span className={StyleSheet.wantedNumberWrapper}>
          {game.mojBroj.wantedNumber}
        </span>
      </div>
      <div className={StyleSheet.rowWrapper}>{
        numberBtns.map(item => <NumberBtn key={item.index} {...item} handleNumberChoice={handleNumberChoice} />)
      }</div>
      <div className={StyleSheet.rowWrapper}>
        <button className={StyleSheet.operator} onClick={() => handleOperatorChoice('+')}>{'+'}</button>
        <button className={StyleSheet.operator} onClick={() => handleOperatorChoice('-')}>{'-'}</button>
        <button className={StyleSheet.operator} onClick={() => handleOperatorChoice('*')}>{'*'}</button>
        <button className={StyleSheet.operator} onClick={() => handleOperatorChoice('/')}>{'/'}</button>
        <button className={StyleSheet.operator} onClick={() => handleOperatorChoice('(')}>{'('}</button>
        <button className={StyleSheet.operator} onClick={() => handleOperatorChoice(')')}>{')'}</button>
      </div>
      <div className={StyleSheet.rowWrapper}>
        <span className={StyleSheet.expressionWrapper}>
          {
            expressionParts.length > 0 ?
            `${generateExpression()} = ${evaluateExpression()}` :
            ''
          }
        </span>
        <button className={StyleSheet.backspace} onClick={handleBackSpace}>{'\u232b'}</button>
      </div>
      <div className={StyleSheet.rowWrapper}>
        <button className={StyleSheet.submitBtn} onClick={confirmSubmit}>{text.submitBtn}</button>
      </div>
    </div>
  )
}
const NumberBtn = ({index, content, disabled, handleNumberChoice}: NumberBtnProps) => {
  return <button 
    className={StyleSheet.number}
    onClick={() => handleNumberChoice(index)}
    disabled={disabled} 
  > 
    {content}
  </button>
}