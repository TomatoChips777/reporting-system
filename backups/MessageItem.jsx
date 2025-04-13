import React, { memo } from "react";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";

const MessageItem = memo(({ message, user, formatTime }) => (
    <div key={message.id} className={`message ${message.senderId === user.id ? "sent" : "received"}`}>
        {/* Message Bubble */}
        {message.text && (
            <div className="message-bubble">
                {message.text}
                <div className="message-meta">
                    <small className="text-muted">{formatTime(message.created_at)}</small>
                    {message.senderId === user.id && (
                        <span className="ms-1">
                            {message.status === "read" ? <BsCheck2All className="text-primary" /> : <BsCheck2 className="text-muted" />}
                        </span>
                    )}
                </div>
            </div>
        )}

        {/* Image Appears Below the Text */}
        {message.image_path && (
            <div className="message-image" style={{ marginTop: "5px", textAlign: message.senderId === user.id ? "right" : "left" }}>
                <img src={`http://localhost:5000/uploads/${message.image_path}`} alt="Sent" style={{ maxWidth: "200px", borderRadius: "8px" }} />
            </div>
        )}
    </div>
));

export default MessageItem;
