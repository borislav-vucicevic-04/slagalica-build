import StyleSheet from './ControlPanel.module.css'
import type { TGameNamesForPoints } from './../../interfaces/gameNamesForPoints';
import loadTranslation from '../../assets/locales/translationLoader';
import { useLocale } from '../../context/locale.context'
import { useBlocker, useNavigate } from 'react-router-dom';
import { AsyncDialog, Dialogs } from 'bv-react-async-dialogs';
import { usePoints } from '../../context/points.context';
import { usePlayed } from '../../context/played.context';
import { useEffect } from 'react';

export default function ControlPanel() {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const text: any = loadTranslation(locale, 'controlPanel');
  const { points, setPoints } = usePoints();
  const { played } = usePlayed();
  const blocker = useBlocker((obj) => {
    const { nextLocation } = obj;
    
    const gameName = nextLocation.pathname.split('/').pop(); // pull out the last part of the pathname which is name of the game

    switch(gameName) {
      case 'slagalica': return played.slagalica;
      case 'moj-broj': return played.mojBroj;
      default: break;
    }
    
    return nextLocation.pathname === '/slagalica-build' || nextLocation.pathname === '/slagalica-build/';
  });
  const blockerDialogText: any = loadTranslation(locale, 'blockerDialog');

  const handleGameChoice = async (gameName: TGameNamesForPoints) => {
    let game: string | undefined = undefined;

    switch(gameName) {
      case 'slagalica': game = "slagalica"; setPoints({...points, slagalica: 0}); break;
      case 'mojBroj': game = "moj-broj"; setPoints({...points, mojBroj: 0}); break;
      default: break;
    }
    if(game) navigate(`/slagalica-build/${game}`);
    else await Dialogs.alert({
      title: text.dialogTitle,
      message: text.dialogMessage,
      className: 'asyncDialog'
    })
  }
  const showPoints = async () => {
    await Dialogs.showAsyncDialog('points-table')
  }
  const generatePointsTable = () => {
    let total = 0;
    const rows: React.ReactNode[] = Object.entries(points).map(item => {
      const key = item[0] as TGameNamesForPoints;
      const value = Number(item[1]);

      total += value;

      return <tr key={key}>
        <th>{text[`${key}Link`]}</th>
        <td>{value}</td>
      </tr>
    });

    rows.push(<tr key={'totals'}>
      <th>{'Ukupno'}</th>
      <td>{total}</td>
    </tr>)

    return rows
  }

  useEffect(() => {
    document.title = 'Slagalica Kviz - Kontrolna tabla';

    if(blocker.state === 'blocked') {
      const gameName = blocker.location.pathname.split('/').pop(); // pull out the last part of the pathname which is name of the game
      if(gameName === 'slagalica-build') {
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
    }
  }, [blocker])
  return (
    <div className={StyleSheet.container}>
      <button disabled={played.slagalica} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('slagalica') }>{text.slagalicaLink}</button>
      <button disabled={played.mojBroj} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('mojBroj')}>{text.mojBrojLink}</button>
      <button disabled={played.spajalica} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('spajalica')}>{text.spajalicaLink}</button>
      <button disabled={played.parovi} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('parovi')}>{text.paroviLink}</button>
      <button disabled={played.premetaljka} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('premetaljka')}>{text.desnoLijevoLink}</button>
      <button disabled={played.sef} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('sef')}>{text.sefLink}</button>
      <button disabled={played.zid} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('zid')}>{text.zidLink}</button>
      <button disabled={played.putOkoSvijeta} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('putOkoSvijeta')}>{text.putOkoSvijetaLink}</button>
      <button disabled={played.asocijacije} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('asocijacije')}>{text.asocijacijeLink}</button>
      <button disabled={played.premetaljka} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('premetaljka')}>{text.premetaljkaLink}</button>
      <button disabled={played.skriveneStaze} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('skriveneStaze')}>{text.skriveneStazeLink}</button>
      <button disabled={played.licitacija} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('licitacija')}>{text.licitacijaLink}</button>
      <button className={StyleSheet.controlBtn} onClick={showPoints}>{text.poeniLink}</button>
      <AsyncDialog
        id='points-table'
        title='Poeni'
        className={`asyncDialog ${StyleSheet.pointsDialog}`}
      >{
        <table>
          <thead></thead>
          <tbody>{generatePointsTable()}</tbody>
        </table>
      }</AsyncDialog>
    </div>
  )
}
