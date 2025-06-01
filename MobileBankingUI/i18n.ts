import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ⚡️ Importer directement les fichiers de traductions
import enAccount from './locales/en/account.json';
import ptAccount from './locales/pt/account.json';
import frAccount from './locales/fr/account.json';

import enSettings from './locales/en/settings.json';
import ptSettings from './locales/pt/settings.json';
import frSettings from './locales/fr/settings.json';

import enauth from './locales/en/auth.json';
import ptauth from './locales/pt/auth.json';
import frauth from './locales/fr/auth.json';

import enbankInfo from './locales/en/bankInfo.json';
import ptbankInfo from './locales/pt/bankInfo.json';
import frbankInfo from './locales/fr/bankInfo.json';


import enCamera from './locales/en/camera.json';
import ptCamera from './locales/pt/camera.json';
import frCamera from './locales/fr/camera.json';



import enCamera1 from './locales/en/camera1.json';
import ptCamera1 from './locales/pt/camera1.json';
import frCamera1 from './locales/fr/camera1.json';


import enCard from './locales/en/card.json';
import ptCard from './locales/pt/card.json';
import frCard from './locales/fr/card.json';

import enCardApplication from './locales/en/cardApplication.json';
import ptCardApplication from './locales/pt/cardApplication.json';
import frCardApplication from './locales/fr/cardApplication.json';


import enChangePin from './locales/en/changePin.json';
import ptChangePin from './locales/pt/changePin.json';
import frChangePin from './locales/fr/changePin.json';

import enContact from './locales/en/contact.json';
import ptContact from './locales/pt/contact.json';
import frContact from './locales/fr/contact.json';


import enDashboard from './locales/en/dashboard.json';
import ptDashboard from './locales/pt/dashboard.json';
import frDashboard from './locales/fr/dashboard.json';

import enDocumentSelection from './locales/en/documentSelection.json';
import ptDocumentSelection from './locales/pt/documentSelection.json';
import frDocumentSelection from './locales/fr/documentSelection.json';

import enExchange from './locales/en/exchange.json';
import ptExchange from './locales/pt/exchange.json';
import frExchange from './locales/fr/exchange.json';

import enFaceDetection from './locales/en/faceDetection.json';
import ptFaceDetection from './locales/pt/faceDetection.json';
import frFaceDetection from './locales/fr/faceDetection.json';

import enGetStarted from './locales/en/getStarted.json';
import ptGetStarted from './locales/pt/getStarted.json';
import frGetStarted from './locales/fr/getStarted.json';

import enIdScan from './locales/en/idScan.json';
import ptIdScan from './locales/pt/idScan.json';
import frIdScan from './locales/fr/idScan.json';

import enLogin from './locales/en/login.json';
import ptLogin from './locales/pt/login.json';
import frLogin from './locales/fr/login.json';

import enNotifications from './locales/en/notifications.json';
import ptNotifications from './locales/pt/notifications.json';
import frNotifications from './locales/fr/notifications.json';

import enOnboarding from './locales/en/onboarding.json';
import ptOnboarding from './locales/pt/onboarding.json';
import frOnboarding from './locales/fr/onboarding.json';


import enPayment from './locales/en/payment.json';
import ptPayment from './locales/pt/payment.json';
import frPayment from './locales/fr/payment.json';

import enPaymentChoice from './locales/en/paymentChoice.json';
import ptPaymentChoice from './locales/pt/paymentChoice.json';
import frPaymentChoice from './locales/fr/paymentChoice.json';


import enPinLogin from './locales/en/pinLogin.json';
import ptPinLogin from './locales/pt/pinLogin.json';
import frPinLogin from './locales/fr/pinLogin.json';

import enPrivacy from './locales/en/privacy.json';
import ptPrivacy from './locales/pt/privacy.json';
import frPrivacy from './locales/fr/privacy.json';


import enProfile from './locales/en/profile.json';
import ptProfile from './locales/pt/profile.json';
import frProfile from './locales/fr/profile.json';


import enScanCard from './locales/en/scanCard.json';
import ptScanCard from './locales/pt/scanCard.json';
import frScanCard from './locales/fr/scanCard.json';

import enSendMoney from './locales/en/sendMoney.json';
import ptSendMoney from './locales/pt/sendMoney.json';
import frSendMoney from './locales/fr/sendMoney.json';



import enSignup from './locales/en/signup.json';
import ptSignup from './locales/pt/signup.json';
import frSignup from './locales/fr/signup.json';

import enSignupSuccess from './locales/en/signupSuccess.json';
import ptSignupSuccess from './locales/pt/signupSuccess.json';
import frSignupSuccess from './locales/fr/signupSuccess.json';

import enTransactionHistory from './locales/en/transactionHistory.json';
import ptTransactionHistory from './locales/pt/transactionHistory.json';
import frTransactionHistory from './locales/fr/transactionHistory.json';

import enVerification from './locales/en/verification.json';
import ptVerification from './locales/pt/verification.json';
import frVerification from './locales/fr/verification.json';

import enscanPassport from './locales/en/scanPassport.json';
import ptscanPassport from './locales/pt/scanPassport.json';
import frscanPassport from './locales/fr/scanPassport.json';





i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // langue par défaut
    fallbackLng: 'en', // fallback en anglais
    resources: {
      en: {
        account: enAccount,
        settings: enSettings,
        auth:enauth,
        bankInfo:enbankInfo,
        camera: enCamera,
        camera1: enCamera1,
        card: enCard,
        cardApplication: enCardApplication,
        changePin: enChangePin,
        contact: enContact,
        dashboard: enDashboard,
        documentSelection: enDocumentSelection,
        exchange: enExchange,
        faceDetection: enFaceDetection,
        getStarted: enGetStarted,
        idScan: enIdScan,
        login: enLogin,
        notifications: enNotifications,
        onboarding: enOnboarding,
        payment: enPayment,
        paymentChoice: enPaymentChoice,
        pinLogin: enPinLogin,
        privacy: enPrivacy,
        profile: enProfile,
        scanCard: enScanCard,
        sendMoney: enSendMoney,
        signup: enSignup,
        signupSuccess: enSignupSuccess,
        transactionHistory: enTransactionHistory,
        scanPassport :enscanPassport ,
      
        verification: enVerification
      },
      pt: {
        account: ptAccount,
        settings: ptSettings,
        auth:ptauth,
        bankInfo:ptbankInfo,
        camera: ptCamera,
        camera1: ptCamera1,
        card: ptCard,
        cardApplication: ptCardApplication,
        changePin: ptChangePin,
        contact: ptContact,
        dashboard: ptDashboard,
        documentSelection: ptDocumentSelection,
        exchange: ptExchange,
        faceDetection: ptFaceDetection,
        getStarted: ptGetStarted,
        idScan: ptIdScan,
        login: ptLogin,
        notifications: ptNotifications,
        onboarding:ptOnboarding,
        payment: ptPayment,
        paymentChoice: ptPaymentChoice,
        pinLogin: ptPinLogin,
        privacy: ptPrivacy,
        profile: ptProfile,
        scanCard: ptScanCard,
        sendMoney: ptSendMoney,
        signup: ptSignup,
        signupSuccess: ptSignupSuccess,
        transactionHistory: ptTransactionHistory,
        scanPassport :ptscanPassport ,
        verification: ptVerification
      },
      fr: {
        account: frAccount,
        settings: frSettings,
        auth:frauth,
        bankInfo:frbankInfo,
        camera: frCamera,
        camera1: frCamera1,
        card: frCard,
        cardApplication: frCardApplication,
        changePin: frChangePin,
        contact: frContact,
        dashboard: frDashboard,
        documentSelection: frDocumentSelection,
        exchange: frExchange,
        faceDetection: frFaceDetection,
        getStarted: frGetStarted,
        idScan: frIdScan,
        login: frLogin,
        notifications: frNotifications,
        onboarding: frOnboarding,
        payment: frPayment,
        paymentChoice: frPaymentChoice,
        pinLogin: frPinLogin,
        privacy: frPrivacy,
        profile: frProfile,
        scanCard: frScanCard,
        sendMoney: frSendMoney,
        signup: frSignup,
        signupSuccess: frSignupSuccess,
        transactionHistory: frTransactionHistory,
        scanPassport :frscanPassport ,
      
        verification: frVerification
      },
    },
    ns: ['account', 'auth', 'bankInfo', 'camera', 'camera1', 'card', 
      'cardApplication', 'changePin', 'contact', 'dashboard', 
      'documentSelection', 'exchange', 'faceDetection', 'getStarted', 
      'idScan', 'login', 'notifications', 'onboarding', 'payment', 
      'paymentChoice', 'pinLogin', 'privacy', 'profile', 'scanCard', 
      'sendMoney', 'settings', 'signup', 'signupSuccess',   'scanPassport',
      'transactionHistory', 'verification'
    ], // liste des namespaces utilisés
    defaultNS: 'account',
    interpolation: {
      escapeValue: false,
    },
    
  });

export default i18n;
