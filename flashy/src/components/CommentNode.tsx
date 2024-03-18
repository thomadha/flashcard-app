import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

interface CommentItem {
  id: number;
  name: string;
  items: CommentItem[];
}

export const useNode = () => {
  // Function to insert a new node into the tree
const insertNode = async function(tree: any, commentId: number, item:  CommentItem[]) {
    if (tree.id === commentId) {
      // If the current node matches the commentId, insert a new node
      const date = new Date().getTime();
      const newPath = tree.path + "/" + date + "/children";
      tree.items.push({
        id: date, // Unique identifier for the new node
        name: item, // Name of the new node
        items: [], // Child nodes of the new node
        path: newPath, // Path of the new node
      });
      try {
        // Add the new comment to the Firestore collection
        await addDoc(collection(db, newPath), {
          id: date, // Unique identifier for the new node
          name: item, // Name of the new node
          items: [], // Child nodes of the new node
          path: newPath, // Path of the new node
        });
        console.log("New comment added to Firestore");
    } catch (error) {
        console.error("Error adding new comment to Firestore:", error);
        // Handle error
    }
      return tree;
    }

    let latestNode = [];
    latestNode = tree.items.map((ob: any) => {
      return insertNode(ob, commentId, item);
    });

    return { ...tree, items: latestNode };
  };

  // Function to edit the name of a node in the tree
  const editNode = (tree: any, commentId: number, value: string) => {
    if (tree.id === commentId) {
      // If the current node matches the commentId, update the name
      tree.name = value; // Update the name of the node
      return tree;
    }

    tree.items.map((ob: any) => {
      return editNode(ob, commentId, value);
    });

    return { ...tree };
  };

  // Function to delete a node from the tree
  const deleteNode = (tree: any, id: number) => {
    for (let i = 0; i < tree.items.length; i++) {
      const currentItem = tree.items[i];
      if (currentItem.id === id) {
        // If the current node matches the id, remove it from the tree
        tree.items.splice(i, 1); // Remove the node from the tree
        return tree;
      } else {
        deleteNode(currentItem, id);
      }
    }
    return tree;
  };

  return { insertNode, editNode, deleteNode };
};

export default useNode;
