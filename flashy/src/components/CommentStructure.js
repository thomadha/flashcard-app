import { useState, useEffect } from "react";
import Comment from "./Comment";
import '../style/Style.css';
import { useNode } from "./CommentNode";
import { addDoc, collection, collectionGroup, doc, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";
import { useLocation } from "react-router-dom";

// Initial comments data structure
const comments = {
    id: 1,
    items: [],
};

export default function CommentStructure() {
    const [commentsData, setCommentsData] = useState(comments);
    const location = useLocation();
    const [flashcardsetId, creatorId] = location.state.pageArray;
    const path = "flashcardSets/" + flashcardsetId+  "/comments";
    const fetchParentComments = async () => {
        try {
                const docs = await getDocs(collection(db,path));
                const data = await Promise.all(docs.docs.map(async (doc) => {
                    const childComments = await fetchChildComments(path+ "/"+ doc.data().id + "/children");
                    console.log(doc.data().id, doc.data().name);
                    return { id: doc.data().id, name: doc.data().name, items: childComments };
                }));
                console.log(data);
                setCommentsData({ ...commentsData, items: data });
        } catch (error) {
            setCommentsData(comments);
        }

    };
    const fetchChildComments = async (parentPath) => {
        try {
            const docRef = collection(db, parentPath);
            if ((await getCountFromServer(docRef)).data().count !== 0) {
                const docs = await getDocs(docRef);
                const data = await Promise.all(docs.docs.map(async (doc) => {
                    const childComments = await fetchChildComments(parentPath+ "/"+ doc.data().id + "/children");
                    return { id: doc.data().id, name: doc.data().name, items: childComments };
            }));} 
            else {
                return [];
            }
        } catch (error) {
            console.log("Error fetching child comments: ", error);
            return [];
        }
    };

    useEffect(() => {
        fetchParentComments();
    }, [flashcardsetId]);

    const { insertNode, editNode, deleteNode } = useNode();

    // Function to handle inserting a new comment node
    const handleInsertNode = (parentId, item) => {
        const finalStructure = insertNode(commentsData, parentId, item);
        setCommentsData(finalStructure);
    };

    // Function to handle editing a comment node
    const handleEditNode = (parentId, value) => {
        const finalStructure = editNode(commentsData, parentId, value);
        setCommentsData(finalStructure);
    };

    // Function to handle deleting a comment node
    const handleDeleteNode = (parentId) => {
        const finalStructure = deleteNode(commentsData, parentId);
        const temp = { ...finalStructure };
        setCommentsData(temp);
    };

    return (
        <div className="Commentfield">
            {/* Render the Comment component */}
            <Comment
                handleInsertNode={handleInsertNode}
                handleEditNode={handleEditNode}
                handleDeleteNode={handleDeleteNode}
                comment={commentsData}
            />
        </div>
    );
}