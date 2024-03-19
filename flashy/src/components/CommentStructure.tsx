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
    const [refresh, setRefresh] = useState(1);
    const fetchParentComments = async () => {
        try {
                const docs = await getDocs(collection(db,path));
                const bigL = (await getCountFromServer(collection(db,path))).data().count; 
                console.log("bigL",bigL);
                if(bigL !== 0){   
                let data = await Promise.all(docs.docs.map(async (doc) => {
                    //const childComments = await fetchChildComments(path+ "/"+ doc.data().id);
                    const childComments: never[] = [];
                    console.log("Getting parent",doc.data().id, doc.data().name);
                    return { id: doc.data().id, name: doc.data().name, items: childComments, path: doc.data().path };
                }));
                setCommentsData({...commentsData, items: data});            
                return data;}
                else{
                    setCommentsData(comments);
                    return [];
                }
        } catch (error) {
            console.log("Error fetching parent comments: ", error);
            
            setCommentsData(comments);
        }

    };

    {/*const fetchChildComments = async (parentPath: string): Promise<CommentItem[]> => {
        try {
            const docRef = collection(db, parentPath);
            const bigL = (await getCountFromServer(docRef)).data().count;
            console.log("bigL",bigL);
            
            if (bigL!== 0) {
                const docs = await getDocs(docRef);
                const data = await Promise.all(docs.docs.map(async (doc) => {
                    const childComments = await fetchChildComments(doc.data().path+"/children"+doc.data().id);
                    return { id: doc.data().id, name: doc.data().name, items: childComments, path: doc.data().path};
                }));
                console.log("getting child",data);
                return data;
            } else {
                console.log("empty child");
                return [];
            }
        } catch (error) {
            console.log("Error fetching child comments: ", error);
            return [];
        }
    };*/}

    useEffect(() => {
        setCommentsData(comments)
        fetchParentComments();
    }, []);
    useEffect(() => {
        setCommentsData(comments)
        fetchParentComments();
    }, [refresh]);

    // Function to handle inserting a new comment node
    const handleInsertNode = async (parentId: number, item: CommentItem[]) => {
        const finalStructure = insertNode(commentsData, parentId, item,path);
        setCommentsData(await finalStructure);
    };

    // Function to handle editing a comment node
    const handleEditNode = async (parentId: number, value: string) => {
        const finalStructure = editNode(commentsData, parentId, value, path, refresh,setRefresh);
        setCommentsData(await finalStructure);
        setRefresh(refresh+1);
    };

    // Function to handle deleting a comment node
    const handleDeleteNode = async(parentId: number) => {
        const finalStructure = deleteNode(commentsData, parentId, path);
        const temp = { ...finalStructure };
        setCommentsData(await temp);
        setRefresh(refresh+1);
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
