import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

interface CommentItem {
  id: number;
  name: string;
  items: CommentItem[];
}

export const useNode = () => {
  // Function to insert a new node into the tree
const insertNode = async function(tree: any, commentId: number, item:  CommentItem[],path :string) {
    if (tree.id === commentId) {
      // If the current node matches the commentId, insert a new node
      const date = new Date().getTime();
      const newPath = path + "/"+ date + "/children";

      tree.items.push({
        id: date, // Unique identifier for the new node
        name: item, // Name of the new node
        items: [], // Child nodes of the new node
        path: newPath, // Path of the new node
      });
      try {
        await setDoc(doc(db, path+"/"+date,),{id: date,name:item});
        console.log("New comment added to Firestore");
    } catch (error) {
        console.error("Error adding new comment to Firestore:", error);
        // Handle error 
    }
      return tree;
    }

    let latestNode = [];
    latestNode = tree.items.map((ob: any) => {
      return insertNode(ob, commentId, item, path);
    });

    return { ...tree, items: latestNode };
  };

 // Function to edit the name of a node in the tree
 const editNode = async (tree: any, commentId: number, value: string, path:string, refresh: number, setRefresh:React.Dispatch<React.SetStateAction<number>>) => {
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
    return editNode(ob, commentId, value, path, refresh, setRefresh);
  });

  return { ...tree, items: updatedItems };
};

 // Function to delete a node from the tree
 const deleteNode = async (tree: any, id: number, path: string) => {
  for (let i = 0; i < tree.items.length; i++) {
    const currentItem = tree.items[i];
    if (currentItem.id === id) {
      // If the current node matches the id, remove it from the tree
      tree.items.splice(i, 1); // Remove the node from the tree

      try {
        // Delete the corresponding document from Firestore
        await deleteDoc(doc(db, path + "/" + id));
        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
        // Handle error
      }

      return tree;
    } else {
      // Traverse child nodes recursively
      deleteNode(currentItem, id, path);
    }
  }
  return tree;
};

return { insertNode, editNode, deleteNode };
};

export default useNode;
