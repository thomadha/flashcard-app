export const useNode = () => {
  // Function to insert a new node into the tree
  const insertNode = function (tree, commentId, item) {
    if (tree.id === commentId) {
      // If the current node matches the commentId, insert a new node
      tree.items.push({
        id: new Date().getTime(), // Unique identifier for the new node
        name: item, // Name of the new node
        items: [], // Child nodes of the new node
      });
      return tree;
    }

    let latestNode = [];
    latestNode = tree.items.map((ob) => {
      return insertNode(ob, commentId, item);
    });
 
    return { ...tree, items: latestNode };
  };

  // Function to edit the name of a node in the tree
  const editNode = (tree, commentId, value) => {
    if (tree.id === commentId) {
      // If the current node matches the commentId, update the name
      tree.name = value; // Update the name of the node
      return tree;
    }

    tree.items.map((ob) => {
      return editNode(ob, commentId, value);
    });

    return { ...tree };
  };

  // Function to delete a node from the tree
  const deleteNode = (tree, id) => {
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