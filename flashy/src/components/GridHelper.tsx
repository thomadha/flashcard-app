import { db, auth } from "../lib/firebase/firebase";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";

export async function logButtonclick(itemId: string) {
    const uid = auth.currentUser?.uid;

    if (!uid) {
        return;
    }

    const flashcardSetRef = doc(db, 'flashcardSets', itemId);
    const flashcardSetDoc = await getDoc(flashcardSetRef);

    if (!flashcardSetDoc.exists()) {
        return;
    }

    const likes = flashcardSetDoc.data()?.likes || [];

    if (likes.includes(uid)) {
        const updatedLikes = likes.filter((userId: string) => userId !== uid);
        await updateDoc(flashcardSetRef, { likes: updatedLikes });
    } else {
        const updatedLikes = [...likes, uid];
        await updateDoc(flashcardSetRef, { likes: updatedLikes });
    }
}

export async function initLikes(itemId: string) {
    const flashcardSetRef = doc(db, 'flashcardSets', itemId);
    const flashcardSetDoc = await getDoc(flashcardSetRef);

    if (!flashcardSetDoc.exists()) {
        return 0;
    }

    const likes = flashcardSetDoc.data()?.likes || [];
    return likes.length;
}

export async function favoriteHandler(itemId : string){
    const uid = auth.currentUser?.uid;

    const flashcardSetRef = doc(db, 'flashcardSets', itemId);
    const flashcardSetDoc = await getDoc(flashcardSetRef);

    if (!flashcardSetDoc.exists()) {
        return;
    }
    console.log('updating favorite');
    
    const isFavorite = flashcardSetDoc.data()?.isFavorite || [];
    if(isFavorite == false){
        await updateDoc(flashcardSetRef, {isFavorite: true})
    }
    else if(isFavorite == true){
        await updateDoc(flashcardSetRef, {isFavorite: false})
    }
    else{
        return;
    }
}