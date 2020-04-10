import React from 'react'
import moment from 'moment'

const Notifications = (props) => {
    //we re going to create cloud function that's going to react to someone signing up or creating a project
    return (
        <div className="section">
            <div className="card z-depth-0">
                <div className="card-content">
                    <span className="card-title">Notifications</span>
                    <ul>
                        {props.notifications && props.notifications.map((item) => {
                            //permissions things!
                            return (
                                <li key= {item.id}> {/*need to access specified notif */}
                                    <span className="pink-text">{item.user} </span>
                                    <span>{item.content}</span>
                                    <div className="grey-text note-date">
                                        {moment(item.time.toDate()).fromNow()}
                                    </div>
                                </li>    
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default Notifications