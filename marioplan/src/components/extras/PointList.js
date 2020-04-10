import React from 'react'


const PointList = ({points, deletePoint}) => {


    //console.log(props);

    //const points = props.points;

    const pointList = points ? (
        points.map(point => { //filter is to rewrting under condition, here good is map
            return(
                <div className = "point" key = {point.id}>
                    <div className="card z-depth-0 project-summary">
                        <div className="card-content grey-text text-darken-3">
                            <span className="card-title">{point.name}</span>
                            <p>X = {point.x}</p>
                            <p>Y = {point.y}</p>
                            <button className="btn pink lighten-1 z-depth-0 right" onClick={() => deletePoint(point.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            ) 
        })
    ) : (
        <span>There is no points!</span>
    )



    return (
        <div>
            {pointList}
        </div>
    )
}



export default (PointList)
