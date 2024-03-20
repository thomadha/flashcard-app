import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";

interface CommentItem {
  id: number;
  name: string;
  items: CommentItem[];
}

export const useNode = () => {
  // Function to insert a new node into the tree
const insertNode = async (tree: any, commentId: number, item:  CommentItem[],path :string) =>{
    if (tree.id === commentId) {
      // If the current node matches the commentId, insert a new node
      const date = new Date().getTime();
      const currentUser = auth.currentUser?.uid;
      const createByDoc = await getDoc(doc(db, "user/" + auth.currentUser?.uid));
      const createdBy = createByDoc.exists() ? createByDoc.data()?.username : '';
            tree.items.push({
        id: date, // Unique identifier for the new node
        name: item, // Name of the new node
        items: [], // Child nodes of the new node
        path: path, // Path of the new node
      });
      try {
        await setDoc(doc(db, path+"/"+date,),{id: date,name:item, uid: currentUser, createdBy: createdBy});
        console.log("New comment added to Firestore");
    } catch (error) {
        console.error("Error adding new comment to Firestore:", error);
        // Handle error 
    }
      return tree;
    }
  };

 // Function to edit the name of a node in the tree
 const editNode = async (tree: any, commentId: number, value: string, path:string, ) => {
  if (tree.id === commentId) {
    // If the current node matches the commentId, update the name
    tree.name = value; // Update the name of the node

    try {
      // Update the corresponding document in Firebase with the new name
      await updateDoc(doc(db, path +"/"+ commentId), {
        name: value
      });
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
      console.log(tree.path);
      
      // Handle error
    }

    return tree;
  }

  // Traverse through child nodes recursively
  const updatedItems = tree.items.map((ob: any) => {
    return editNode(ob, commentId, value, path);
  });

  return { ...tree, items: updatedItems };
};

 // Function to delete a node from the tree
 const deleteNode = async (tree: CommentItem, id: number, path: string) => {
  console.log("Deleting node with id:", id);
  await deleteDoc(doc(db, path +"/"+ id));
};

return { insertNode, editNode, deleteNode };
};

export default useNode;
