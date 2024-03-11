import React, { useEffect, useState } from 'react';
import { useSetNames } from "./FetchFirestoreData";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { favoriteHandler, logButtonclick } from './GridHelper';

export interface Item {
    id: string;
    name: string;
    creatorId: string;
    likes: number;
}

interface gridProps {
    filter: string;
    searchItem: string;
    page: number;
}

const Grid: React.FC<gridProps> = ({ filter, searchItem, page }) => {
    const navigateTo = useNavigate();
    const { flashcardSetData, fetchData } = useSetNames();
    const [itemsArray, setItemsArray] = useState<Item[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchData(filter, page);
    }, [filter, page]); // Fetch data when filter or page changes

    useEffect(() => {
        if (flashcardSetData) {
            const filtered = flashcardSetData.filter(item =>
                item.name.toLowerCase().startsWith(searchItem.toLowerCase())
            );
            setItemsArray(filtered);
        }
    }, [flashcardSetData, searchItem]);

    useEffect(() => {
        const checkAdminStatus = async () => {
            const isAdminResult = await CheckIfAdmin();
            if (isAdminResult) {
                setIsAdmin(true);
            }
        };
        checkAdminStatus();
    }, []);

    async function CheckIfAdmin() {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user != null && user.email != null) {
            const mail = user.email;
            const arrayRef = doc(db, "Administratorer", "UsersWithAdmin");
            const AdminArrayDoc = await getDoc(arrayRef);
            return AdminArrayDoc.get("AdminArray").includes(mail);
        } else {
            return false;
        }
    }

    const gotoPage = (id: string, creatorId: string) => {
        const pageArray = [id, creatorId];
        navigateTo("/cards", { state: { pageArray } });
    }

    const gotoEdit = (id: string) => (event: React.MouseEvent) => {
        event.stopPropagation();
        const editArray = [id, "", false];
        navigateTo("/edit", { state: { editArray } });
    }

    const deleteSet = (id: string) => async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            if (id !== undefined) {
                const docRef = doc(db, "flashcardSets", id);
                await deleteDoc(docRef);
                fetchData(filter, page);
            }
        } catch (e) {
            return;
        }
    }

    //Håndterer når like knappen blir trykket på
    const changeLike = (itemId: string) => async (event: React.MouseEvent) => {
        event.stopPropagation();
        logButtonclick(itemId);
        fetchData(filter, page);
    }

    //Håndterer når favoritt knappen blir trykket på
    const changeFavorite = (id: string) => (event: React.MouseEvent) => {
        event.stopPropagation();
        favoriteHandler(id);
        fetchData(filter, page);
    }

    return (
        <div className="grid-container">
            {itemsArray.map((item) => (
                <div key={item.id} className="grid-item" onClick={() => gotoPage(item.id, item.creatorId)}>
                    <div>{item.name}</div>
                    <button onClick={gotoEdit(item.id)}>Rediger</button>
                    {isAdmin && (
                        <button className="deleteButton" onClick={(event) => deleteSet(item.id)(event)}> Slett </button>
                    )}
                    <img src={require('../pictures/1000_F_238719835_fdgaiXccSVeBhcr0ZSAn1c1iny0T764d.png')} id='favoriteimage'
                        onClick={(event) => changeFavorite(item.id)(event)}></img>
                    <button onClick={(event) => changeLike(item.id)(event)}>{item.likes} likes</button>
                </div>
            ))}
        </div>
    );
}

export default Grid;
