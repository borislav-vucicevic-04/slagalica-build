// serbain translations
import homeSR from './sr/home.json'
import controlPanelSR from './sr/controlPanel.json'
import slagalicaSR from './sr/slagalica.json'
import mojBrojSR from './sr/mojBroj.json'
import spajalicaSR from './sr/spajalica.json'
import paroviSR from './sr/parovi.json'
import desnoLijevoSR from './sr/desnoLijevo.json'
import blockerDialogSR from './sr/blockerDialog.json'
// english translations
import homeEN from './en/home.json'
import controlPanelEN from './en/controlPanel.json'
import slagalicaEN from './en/slagalica.json'
import mojBrojEN from './en/mojBroj.json'
import spajalicaEN from './en/spajalica.json'
import paroviEN from './en/parovi.json'
import desnoLijevoEN from './en/desnoLijevo.json'
import blockerDialogEN from './en/blockerDialog.json'

type Locale = 'sr' | 'en'
type Page = 'home'| 'controlPanel' | 'slagalica' | 'mojBroj' | 'spajalica' | 'parovi' | 'desnoLijevo' | 'blockerDialog'

const translations = {
  sr: {
    home: homeSR,
    controlPanel: controlPanelSR,
    slagalica: slagalicaSR,
    mojBroj: mojBrojSR,
    spajalica: spajalicaSR,
    parovi: paroviSR,
    desnoLijevo: desnoLijevoSR,
    blockerDialog: blockerDialogSR
  },
  en: {
    home: homeEN,
    controlPanel: controlPanelEN,
    slagalica: slagalicaEN,
    mojBroj: mojBrojEN,
    spajalica: spajalicaEN,
    parovi: paroviEN,
    desnoLijevo: desnoLijevoEN,
    blockerDialog: blockerDialogEN
  }
}

const loadTranslation = (locale: Locale, page: Page) => {
  return translations[locale][page]
}

export default loadTranslation