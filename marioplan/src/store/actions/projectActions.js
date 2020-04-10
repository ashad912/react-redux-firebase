export const createProject = (project) => {
    //return {
        //we used to doin
        //type: 'ADD_PROJECT',
        //project: project

    //}
    return (dispatch, getState, { getFirebase, getFirestore }) => { //in curly bracers - extra args
        //make async call to database
        const firestore = getFirestore();
        //adding document through collection
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid
        firestore.collection('projects').add({
            ...project, //all field covered in project object (id, title, content)
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => { //only fire when completed
            dispatch({type: 'CREATE_PROJECT', project: project})
        }).catch((err) => {
            dispatch({type : 'CREATE_PROJECT_ERROR', err})
        }) 
        
    }
}