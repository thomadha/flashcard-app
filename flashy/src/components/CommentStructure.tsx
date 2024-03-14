import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import '../style/Style.css';
import { useNode } from "./CommentNode";
import { addDoc, collection, collectionGroup, doc, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";
import { useLocation } from "react-router-dom";

// Initial comments data structure
interface CommentItem {
    id: number;
    name: string;
    items: CommentItem[];
}

const comments: CommentItem = {
    id: 1,
    name: "",
    items: [],
};

export default function CommentStructure() {
    const [commentsData, setCommentsData] = useState<CommentItem>(comments);
    const location = useLocation();
    const [flashcardsetId, creatorId] = location.state.pageArray;
    const path = "flashcardSets/" + flashcardsetId+  "/comments";
    const { insertNode, editNode, deleteNode } = useNode();

    const fetchParentComments = async () => {
        try {
                const docs = await getDocs(collection(db,path));
                let data = await Promise.all(docs.docs.map(async (doc) => {
                    const childComments = await fetchChildComments(path+ "/"+ doc.data().id + "/children");
                    console.log(doc.data().id, doc.data().name);
                    return { id: doc.data().id, name: doc.data().name, items: childComments };
                }));
                setCommentsData({...commentsData, items: data});
                return data;
        } catch (error) {
            setCommentsData(comments);
        }

    };

    const fetchChildComments = async (parentPath: string): Promise<CommentItem[]> => {
        try {
            const docRef = collection(db, parentPath);
            if ((await getCountFromServer(docRef)).data().count !== 0) {
                const docs = await getDocs(docRef);
                const data = await Promise.all(docs.docs.map(async (doc) => {
                    const childComments = await fetchChildComments(parentPath+ "/"+ doc.data().id + "/children");
                    return { id: doc.data().id, name: doc.data().name, items: childComments };
                }));
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.log("Error fetching child comments: ", error);
            return [];
        }
    };

    useEffect(() => {
        fetchParentComments();
    }, []);
    

    // Function to handle inserting a new comment node
    const handleInsertNode = (parentId: number, item: CommentItem[]) => {
        const finalStructure = insertNode(commentsData, parentId, item);
        setCommentsData(finalStructure);
    };

    // Function to handle editing a comment node
    const handleEditNode = (parentId: number, value: string) => {
        const finalStructure = editNode(commentsData, parentId, value);
        setCommentsData(finalStructure);
    };

    // Function to handle deleting a comment node
    const handleDeleteNode = (parentId: number) => {
        const finalStructure = deleteNode(commentsData, parentId);
        const temp = { ...finalStructure };
        setCommentsData(temp);
    };

    return (
        <Comment
            key={commentsData.id}
            handleInsertNode={handleInsertNode}
            handleEditNode={handleEditNode}
            handleDeleteNode={handleDeleteNode}
            comment={commentsData}
        />
    );
}
