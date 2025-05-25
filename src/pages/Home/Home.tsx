import { Link, useNavigate } from 'react-router-dom';
import loadTranslation from '../../assets/locales/translationLoader';
import { useLocale } from '../../context/locale.context'
import StyleSheet from './Home.module.css'
import { useState } from 'react';
import { useGame } from '../../context/game.context';
import generateGame from '../../utils/generateGame.utils';
import type IPoints from '../../interfaces/points.interface';
import { usePoints } from '../../context/points.context';

export default function Home() {
  const navigate = useNavigate();
  const { locale, setLocale } = useLocale();
  const { setGame } = useGame();
  const { setPoints } = usePoints();
  const [text, setText] = useState<any>(loadTranslation(locale, 'home'));
  const handleLocaleSwitch = (newLocale: 'sr' | 'en') => {
    setText(loadTranslation(newLocale, 'home'));
    setLocale(newLocale)
  }
  const handlePlay = async () => {
    const game = await generateGame(locale);
    const points: IPoints = {
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
    }
    setGame(game);
    setPoints(points);
    navigate('/control-panel')
  }
  return (
    <div className={StyleSheet.container}>
      <button className={StyleSheet.playBtn} onClick={handlePlay}>{text.playBtn}</button>
      <div className={StyleSheet.localeSwitchWrapper}>
        <button className={StyleSheet.localeSwitch} onClick={() => handleLocaleSwitch('sr')}></button>
        <button className={StyleSheet.localeSwitch} onClick={() => handleLocaleSwitch('en')}></button>
      </div>
      <div className={StyleSheet.linkWrapper}>
        <Link to={'/credits'} className={StyleSheet.link}>{text.creditsLink}</Link>
        <Link to={'/instructions'} className={StyleSheet.link}>{text.instructionsLink}</Link>
      </div>
    </div>
  )
}
