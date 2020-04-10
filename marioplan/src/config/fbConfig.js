import firebase from 'firebase/app' //base func
import 'firebase/firestore' //DB
import 'firebase/auth'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD0gZiNi1lZRdXvKN_WCt-jiwGiJVI-tVQ",
    authDomain: "ashad912-marioplan.firebaseapp.com",
    databaseURL: "https://ashad912-marioplan.firebaseio.com",
    projectId: "ashad912-marioplan",
    storageBucket: "ashad912-marioplan.appspot.com",
    messagingSenderId: "248850659528"
};
firebase.initializeApp(config);
//firebase.firestore().settings({timestampsInSnapshots: true}) 
//avoiding truncation during calling Date (firebase return Timestamp instead) - its not necessery now

export default firebase;

/*

Firestore is NoSQL database
Collection (projects):
doc1
doc2 -> title: 'house party!'   content: 'bla'  authorFirstName: .... <- fields
doc3
doc4

*/
