import StyleSheet from './ControlPanel.module.css'
import type { TGameNamesForPoints } from './../../interfaces/gameNamesForPoints';
import loadTranslation from '../../assets/locales/translationLoader';
import { useLocale } from '../../context/locale.context'
import { useNavigate } from 'react-router-dom';
import { AsyncDialog, Dialogs } from 'bv-react-async-dialogs';
import { usePoints } from '../../context/points.context';

export default function ControlPanel() {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const text: any = loadTranslation(locale, 'controlPanel');
  const { points, setPoints } = usePoints();

  const handleGameChoice = async (gameName: TGameNamesForPoints) => {
    let game: string | undefined = undefined;

    switch(gameName) {
      case 'slagalica': game = "slagalica"; setPoints({...points, slagalica: 0}); break;
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
  return (
    <div className={StyleSheet.container}>
      <button disabled={points.slagalica !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('slagalica') }>{text.slagalicaLink}</button>
      <button disabled={points.mojBroj !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('mojBroj')}>{text.mojBrojLink}</button>
      <button disabled={points.spajalica !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('spajalica')}>{text.spajalicaLink}</button>
      <button disabled={points.parovi !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('parovi')}>{text.paroviLink}</button>
      <button disabled={points.premetaljka !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('premetaljka')}>{text.desnoLijevoLink}</button>
      <button disabled={points.sef !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('sef')}>{text.sefLink}</button>
      <button disabled={points.zid !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('zid')}>{text.zidLink}</button>
      <button disabled={points.putOkoSvijeta !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('putOkoSvijeta')}>{text.putOkoSvijetaLink}</button>
      <button disabled={points.asocijacije !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('asocijacije')}>{text.asocijacijeLink}</button>
      <button disabled={points.premetaljka !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('premetaljka')}>{text.premetaljkaLink}</button>
      <button disabled={points.skriveneStaze !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('skriveneStaze')}>{text.skriveneStazeLink}</button>
      <button disabled={points.muzickaLicitacija !== null} className={StyleSheet.controlBtn} onClick={() => handleGameChoice('muzickaLicitacija')}>{text.muzickaLicitacijaLink}</button>
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
