import { useBlocker } from 'react-router-dom';
import { useEffect } from 'react';
import { Dialogs } from 'bv-react-async-dialogs'; // Replace with your actual import
import { useLocale } from '../context/locale.context';
import loadTranslation from '../assets/locales/translationLoader';

export default function useDialogBlocker(shouldBlock: boolean) {
  const blocker = useBlocker(shouldBlock);
  const { locale } = useLocale();
  const text: any = loadTranslation(locale, 'dialogBlocker');
  const shouldProceed = !!localStorage.getItem('shouldProceed')

  useEffect(() => {
    if (blocker.state === 'blocked') {
      console.log(shouldProceed);
      
      if(shouldProceed) {
        localStorage.removeItem('shouldProceed');
        blocker.proceed();
      }
      // Show your custom confirmation dialog
      else {
        Dialogs.confirm({
          title: text.title,
          message: text.message,
          okText: text.okText,
          cancelText: text.cancelText,
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
  }, [blocker]);
}
