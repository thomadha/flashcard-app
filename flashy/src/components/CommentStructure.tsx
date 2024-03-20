import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import '../style/Style.css';
import { useNode } from "./CommentNode";
import { addDoc, collection, collectionGroup, doc, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";
import { useLocation } from "react-router-dom";
import { updateLanguageServiceSourceFile } from "typescript";

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
    const [deletedIDs, setDeletedIDs] = useState<number[]>([]);
    const fetchParentComments = async () => {
        try {
                const docs = await getDocs(collection(db,path));
                const bigL = (await getCountFromServer(collection(db,path))).data().count; 
                if(bigL !== 0){   
                let data = await Promise.all(docs.docs.map(async (doc) => {
                    //const childComments = await fetchChildComments(path+ "/"+ doc.data().id);
                    const childComments: never[] = [];
                    console.log("Getting parent",doc.data().id, doc.data().name);
                    return { id: doc.data().id, name: doc.data().name, items: childComments, createdBy: doc.data().createdBy, uid: doc.data().uid};
                }));
                setCommentsData({...commentsData, items: data});}
                else{
                    setCommentsData(comments);}
                }
        catch (error) {
            console.log("Error fetching parent comments: ", error);
        }

    };

    useEffect(() => { 
        setCommentsData(comments)
        fetchParentComments();
    }, []);


    // Function to handle inserting a new comment node
    const handleInsertNode = async (parentId: number, item: CommentItem[]) => {
        insertNode(commentsData, parentId, item,path).then(() =>{refresh()});
    };

    // Function to handle editing a comment node
    const handleEditNode = async (parentId: number, value: string) => {
        editNode(commentsData, parentId, value, path).then(() =>{refresh()});
    };

    // Function to handle deleting a comment node
    const handleDeleteNode = async(parentId: number) => {
        setDeletedIDs([...deletedIDs, parentId]);
        await deleteNode(commentsData, parentId, path);
        refresh();
    };

    const refresh = () => {
        console.log("refreshing");
        
        setCommentsData(comments);
        fetchParentComments();
    }

    useEffect(() => {
        console.log("commentsData got changed", commentsData);
        const updatedItems = commentsData.items.filter(comment => !deletedIDs.includes(comment.id));
        if(updatedItems.length === commentsData.items.length){}
        else{
        setCommentsData(prevState => ({
            ...prevState,
            items: updatedItems
        }));}
    }, [commentsData]);
    
    
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

