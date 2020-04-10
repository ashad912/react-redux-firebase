const initState = {
    appState: 'position',
    mode: 'moving',
    points : [],
    results : [],
    
};


const canvasReducer = (state = initState, action) => {
    switch(action.type){
        case 'CHANGE_MODE':
            
            return {
                ...state,
                mode: action.mode
            }
            
        case 'UPDATE_POINTS':
            return {
                ...state,
                points: action.points
            }
        case 'UPDATE_APP_STATE':
            return {
                ...state,
                appState: action.appState
            }
        case 'UPDATE_RESULTS':
            return {
                ...state,
                results: action.results
            }
        case 'EXPORT_RESULTS':
            return {
                ...state,
                //results: action.results
            }
        default:
            return state
    }
    
}

export default canvasReducer