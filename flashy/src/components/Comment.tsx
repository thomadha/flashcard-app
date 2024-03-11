import { useState, useRef, useEffect } from "react";
import { ReactComponent as DownArrow } from "../pictures/down-arrow.svg";
import { ReactComponent as UpArrow } from "../pictures/up-arrow.svg";

const Comment = ( comment :any ) => {
    const [input, setInput] = useState("")

    const onAddComment = () => {

    };
    return (
    <>
    <div>
        <div className={comment.id === 1 ? 'inputContainer' : 'commentContainer'}>
            {comment.id === 1 ? (
                <>
            <input type="text"
            className="inputContainer__input first_input"
            autoFocus
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="type..."
            />
            <div className="reply comment" onClick={onAddComment}>
                Kommentar
            </div>
            </>) : (
                <span style={{wordWrap: "break-word"}}>
                    {comment.name}
                </span>
            )}
        </div>
        <div style={{paddingLeft: 25}}>
        {comment?.items?.map((cmnt :any) => {
            return (<Comment key={cmnt.id} comment={cmnt}/>);
        })}
        </div>
    </div>
    </>)
};

export default Comment;