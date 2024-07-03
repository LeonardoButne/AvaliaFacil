import firebase from './node_modules/app';
import './node_modules/firebase/auth';
import './node_modules/firebase/database';


// import 'firebase/auth';
// import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyA5W3WDwlAgF8Qn5ptmZ4V4JvVaHQ5KBEk",
    authDomain: "feedback-aqui.firebaseapp.com",
    databaseURL: "https://feedback-aqui-default-rtdb.firebaseio.com",
    projectId: "feedback-aqui",
    storageBucket: "feedback-aqui.appspot.com",
    messagingSenderId: "390730068105",
    appId: "1:390730068105:web:4f9c564b63192d6ddc5658",
    measurementId: "G-4V5LL17MRE"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const feedbackAquiDB = firebaseApp.database();

export { feedbackAquiDB };
