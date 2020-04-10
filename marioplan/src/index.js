import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware, compose} from 'redux' // to enable store func
import rootReducer from './store/reducers/rootReducer'
import { Provider} from 'react-redux' //to wire reducer to App, and choose store
import thunk from 'redux-thunk' //for asynchronous things
import { reduxFirestore, getFirestore } from 'redux-firestore'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import fbConfig from './config/fbConfig'


//there is need to use store enhancers with join firebase and firestore with our project
const store = createStore(rootReducer, 
    compose(
        applyMiddleware(thunk.withExtraArgument({getFirebase, getFirestore})),
        reduxFirestore(fbConfig), 
        reactReduxFirebase(fbConfig, {useFirestoreForProfile: true, userProfile: 'users',  attachAuthIsReady : true}) //now firebase (more precisly: funcs getFirebase and getFirestore) knows about config in projects
    ) //useFirestoneForProfile load extra props to firebase.profile - things like props logged user
);  //thing like logged user, due to showing enhancer which collection is assiociated with userProfile - next param
//attach... app waits to auth init done
//in middleware we manage the asynchronous things - we added to thunk Firebase things

store.firebaseAuthIsReady.then(() => {
    ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
})


