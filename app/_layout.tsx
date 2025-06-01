import { Slot } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import { I18nextProvider } from 'react-i18next'; 
import i18n from '../i18n'; 
import { useEffect } from 'react';

export default function Layout() {
  useEffect(() => {
    console.log('i18n initialized:', i18n.isInitialized);
    console.log('Available languages:', i18n.languages);
  }, []);

  useEffect(() => {

    console.log('English translations:', i18n.getResourceBundle('en', 'account'));
    console.log('Portuguese translations:', i18n.getResourceBundle('pt', 'account'));
  }, []);
  return (
    <UserProvider>
      <I18nextProvider i18n={i18n}> 
        <Slot />
      </I18nextProvider>
    </UserProvider>
  );
}