import React from 'react';
import { Link, browserHistory } from 'react-router';

export default (props) => {


    const activeChat = props.chats.filter((chat) => {
        return chat._id === props.activeChat;
    })

    var activeChatMemberIds;
    var activeUserIds;
    var activeUsers;

    if (props.activeChat !== '') {

        activeChatMemberIds = activeChat[0].members
        activeUsers = props.users.filter((user) => {
            let isMatch = activeChatMemberIds.indexOf(user._id);
            if (isMatch >= 0) { return true } else { return false };

        }) 
        activeUserIds = activeUsers.map((member) => {
               return <p key={member._id}>{member.username}</p>
        });
    } else {
        activeUserIds = () => { return <div></div> }
    }




    return (
        <div className="menu">
            <Link to="/" onClick={props.logOut}>Logout</Link> |
            <Link to="/users">New Chat</Link>
            <p>Logged in as {props.name} </p>
            {activeUserIds}
        </div>
    )
}
