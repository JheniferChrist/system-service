import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyB_habdmobDkwWSxl11M-Au8wPkBN4oWFk",
    authDomain: "sistema-c341c.firebaseapp.com",
    projectId: "sistema-c341c",
    storageBucket: "sistema-c341c.appspot.com",
    messagingSenderId: "913182584375",
    appId: "1:913182584375:web:0514318be05b34aebcd9b2",
    measurementId: "G-RGECZMPBK7"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }


  export default firebase;