import React from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import likesIcon from '../../assets/likes.png'
import commentIcon from '../../assets/chat.png'

function CardPost({ post: { id, body, username, createdAt, comments, likes, } }) {
  const formatDate = formatDistanceToNow(new Date(createdAt));
  return (
    <div className="card-post">
      <h3>{username}</h3>
      <p className="created-at">{formatDate}</p>
      <p>{body}</p>
      <div className="card-post-meta">
        <div className="comment-box icon-box">
          <img className="icon" src={commentIcon} />
          <p className="icon-count">{comments.length}</p>
        </div>
        <div className="likes-box icon-box">
          <img className="icon" src={likesIcon} />
          <p className="icon-count">{likes.length}</p>
        </div>
      </div>
    </div>
  )
}

export default CardPost
