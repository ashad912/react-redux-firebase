const initState = {
    projects: [
        {id: '1', title: 'hehe1', content: 'blaasasa'},
        {id: '2', title: 'hehe2', content: 'blaasasa'},
        {id: '3', title: 'hehe3', content: 'blaasasa'}
    ]
    
};


const projectReducer = (state = initState, action) => {
    switch(action.type){
        case 'CREATE_PROJECT':
            /*console.log('created project', action.project)
            let newProjects = [...state.projects, action.project]
            return {
                ...state,
                projects: newProjects
            };this works as adding content to store - we d like to sync it with db*/
            return state;
        case 'CREATE_PROJECT_ERROR':
            console.log('create project error', action.err)
            return state;
        default:
            return state
    }
    
}

export default projectReducer