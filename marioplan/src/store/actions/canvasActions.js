export const changeMode = (mode) => {
    return {
        type: 'CHANGE_MODE',
        mode: mode
    }
}

export const updatePoints = (points) => {
    return dispatch => {
      return new Promise((resolve, reject) => {
        dispatch({
            type: 'UPDATE_POINTS',
            points: points
        });
  
        resolve()
      });
    }
}

export const updateAppState = (appState) => {
    return dispatch => {
      return new Promise((resolve, reject) => {
        dispatch({
            type: 'UPDATE_APP_STATE',
            appState: appState
        });
  
        resolve()
      });
    }
}

export const updateResults = (results) => {
    return dispatch => {
      return new Promise((resolve, reject) => {
        dispatch({
            type: 'UPDATE_RESULTS',
            results: results
        });
  
        resolve()
      });
    }
}


export const exportResults = (results) => {
    return dispatch => {
      return new Promise((resolve, reject) => {
        dispatch({
            type: 'EXPORT_RESULTS',
            results: results
        });
  
        resolve()
      });
    }
}






