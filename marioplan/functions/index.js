const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

//cloud funcs heeeere!

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase) // we say - using admin SDK to deal with app xd

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello Ninjas!");
});

const createNotification = (notification) => {
    return admin.firestore().collection('notifications').add(notification)
    .then(doc => //these doc which was created as a notif
        console.log('notification added', doc)
    )
}


//notif to project creation
exports.projectCreated = functions.firestore
    .document('projects/{projectId}')
    .onCreate (doc => {
        const project = doc.data();
        const notification = {
            content : 'Added a new project',
            user: `${project.authorFirstName} ${project.authorLastName}`, //template syntax here xd
            time: admin.firestore.FieldValue.serverTimestamp()
        }

        return createNotification(notification)

})

exports.userJoined = functions.auth //we'r using auth service
    .user()
    .onCreate(user =>{
        
        return admin.firestore().collection('users') //we have to find user, grab him, and take data associated - its reference
        .doc(user.uid).get().then(doc => { //get() is async req
            const newUser = doc.data()
            const notification = {
                content: 'Joined the party',
                user: (newUser.firstName + ' ' + newUser.lastName),
                time: admin.firestore.FieldValue.serverTimestamp()
            }
        
        return createNotification(notification)

        })
    })
