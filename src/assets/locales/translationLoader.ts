// serbain translations
import homeSR from './sr/home.json'
import controlPanelSR from './sr/controlPanel.json'
import slagalicaSR from './sr/slagalica.json'
import dialogBlockerSR from './sr/dialogBlocker.json'
// english translations
import homeEN from './en/home.json'
import controlPanelEN from './en/controlPanel.json'
import slagalicaEN from './en/slagalica.json'
import dialogBlockerEN from './en/dialogBlocker.json'

type Locale = 'sr' | 'en'
type Page = 'home'| 'controlPanel' | 'slagalica' | 'dialogBlocker'

const translations = {
  sr: {
    home: homeSR,
    controlPanel: controlPanelSR,
    slagalica: slagalicaSR,
    dialogBlocker: dialogBlockerSR
  },
  en: {
    home: homeEN,
    controlPanel: controlPanelEN,
    slagalica: slagalicaEN,
    dialogBlocker: dialogBlockerEN
  }
}

const loadTranslation = (locale: Locale, page: Page) => {
  return translations[locale][page]
}

export default loadTranslation