import { useState, useRef, useEffect } from "react";
import Action from "./CommentAction";
import { ReactComponent as DownArrow } from "../pictures/down-arrow.svg";
import { ReactComponent as UpArrow } from "../pictures/up-arrow.svg";
/**
 * Represents a Comment component.
 * @param {Object} props - The component props.
 * @param {function} props.handleInsertNode - The function to handle inserting a new node.
 * @param {function} props.handleEditNode - The function to handle editing a node.
 * @param {function} props.handleDeleteNode - The function to handle deleting a node.
 * @param {Object} props.comment - The comment object.
 * @returns {JSX.Element} The Comment component.
 */
const Comment = ({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  comment,
}) => {
  /**
   * Represents the input state.
   * @type {string}
   */
  const [input, setInput] = useState("");

  /**
   * Represents the edit mode state.
   * @type {boolean}
   */
  const [editMode, setEditMode] = useState(false);

  /**
   * Represents the show input state.
   * @type {boolean}
   */
  const [showInput, setShowInput] = useState(false);

  /**
   * Represents the expand state.
   * @type {boolean}
   */
  const [expand, setExpand] = useState(true);

  /**
   * Represents the input ref.
   * @type {React.RefObject}
   */
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  /**
   * Handles creating a new comment.
   */
  const handleNewComment = () => {
    setExpand(expand);
    setShowInput(true);
  };

  /**
   * Handles adding a comment.
   */
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

  /**
   * Handles deleting a comment.
   */
  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };

  return (
    <div>
      <div className={comment.id === 1 ? "inputContainer" : "commentContainer"}>
        {comment.id === 1 ? (
          <>
            {/* Input for the first comment */}
            <input
              type="text"
              className="inputContainer__input first_input"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here..."
            />

            {/* Action button for adding a comment */}
            <Action
              className="reply comment"
              type="COMMENT"
              handleClick={onAddComment}
            />
          </>
        ) : (
          <>
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
                  <Action
                    className="reply"
                    type="EDIT"
                    handleClick={() => {
                      setEditMode(true);
                    }}
                  />
                  <Action
                    className="reply"
                    type="DELETE"
                    handleClick={handleDelete}
                  />
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

        {/* Render child comments */}
        {comment?.items?.map((cmnt) => {
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