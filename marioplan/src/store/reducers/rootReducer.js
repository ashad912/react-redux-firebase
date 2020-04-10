import authReducer from './authReducer'
import projectReducer from './projectReducer'
import { combineReducers} from 'redux'
import { firestoreReducer } from 'redux-firestore' //syncing data with state, in background
import { firebaseReducer } from 'react-redux-firebase'
import canvasReducer from './canvasReducer'


const rootReducer = combineReducers( {
    auth: authReducer,
    project: projectReducer,
    firestore: firestoreReducer, //data depends on component activity
    firebase: firebaseReducer, //sinking firebase info, including auth state
    canvas: canvasReducer
})

export default rootReducer