import React, { useState, useRef, useEffect } from "react";
import Action from "./CommentAction";
import { ReactComponent as DownArrow } from "../pictures/down-arrow.svg";
import { ReactComponent as UpArrow } from "../pictures/up-arrow.svg";
import userImg from "../pictures/user.png";
import { auth } from "../lib/firebase/firebase";

interface CommentProps {
  handleInsertNode: Function;
  handleEditNode: Function;
  handleDeleteNode: Function;
  comment: any; // Define the type of comment object according to your data structure
}

const Comment: React.FC<CommentProps> = ({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  comment,
}) => {
  const [input, setInput] = useState<string>(""); // Define the type of input state
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  const handleNewComment = () => {
    setExpand(expand);
    setShowInput(true);
  };

  const onAddComment = () => {
    if (editMode) {
      handleEditNode(comment.id, inputRef?.current?.innerText);
    } else {
      setExpand(true);
      handleInsertNode(comment.id, input);
      setShowInput(false);
      setInput("");
    }

    if (editMode) setEditMode(false);
  };

  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };
  
  const itemsList = () => {
    console.log("itemsList", comment.items);
    
  }
  itemsList();
  return (
    <div>
      <div className={comment.id === 1  ? "inputContainer" : "commentContainer"}>
        {comment.id === 1  ? (
          <>
            <input
              type="text"
              className="inputContainer__input first_input"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type..."
            />
            <Action
              className="reply comment"
              type="COMMENT"
              handleClick={onAddComment}
            />
          </>
        ) : (
          <>
            <span style={{ fontWeight: "bold" }}>
            <img src={userImg} id="userimage"></img>
              {comment.createdBy}
            </span>
            {/* Display the comment text */}
            <span id="commentText"
              contentEditable={editMode}
              suppressContentEditableWarning={editMode}
              ref={inputRef}
              style={{ wordWrap: "break-word" }}
            >
              {comment.name}
            </span>

            <div style={{ display: "flex", marginTop: "5px" }}>
              {editMode ? (
                <>
                  {/* Action buttons for saving and canceling edit */}
                  <Action
                    className="reply"
                    type="SAVE"
                    handleClick={onAddComment}
                  />
                  <Action
                    className="reply"
                    type="CANCEL"
                    handleClick={() => {
                      if (inputRef.current)
                        inputRef.current.innerText = comment.name;
                      setEditMode(false);
                    }}
                  />
                </>
              ) : (
                <>
                  {(auth.currentUser?.uid == comment.uid)&&<Action
                    className="reply"
                    type="EDIT"
                    handleClick={() => {
                      setEditMode(true);
                    }}
                  />}{(auth.currentUser?.uid == comment.uid)&&
                  <Action
                    className="reply"
                    type="DELETE"
                    handleClick={handleDelete}
                  />}
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
        {showInput && (
          <div className="inputContainer">
            {/* Input for replying to a comment */}
            <input
              type="text"
              className="inputContainer__input"
              autoFocus
              onChange={(e) => setInput(e.target.value)}
            />
            {/* Action buttons for replying and canceling reply */}
            <Action className="reply" type="REPLY" handleClick={onAddComment} />
            <Action
              className="reply"
              type="CANCEL"
              handleClick={() => {
                setShowInput(false);
                if (!comment?.items?.length) setExpand(false);
              }}
            />
          </div>
        )}

        {comment.items.map((cmnt: any) => {
          return (
            <Comment
              key={cmnt.id}
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
              handleDeleteNode={handleDeleteNode}
              comment={cmnt}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Comment;
