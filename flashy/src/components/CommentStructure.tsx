import { useState } from "react";
import Comment from "./Comment";
import '../style/Style.css';

const comments = {
    id: 2,
    items: [
        {
            id: 51,
            name: "hello",
            items: []
        }
    ]
};


export default function CommenStructure() {
    const [commentsData, setCommentsData] = useState(comments);
    return (
        <>
        <div className="CommentStructure">
            <Comment comment={commentsData}/>
        </div>
        </>
    )
}