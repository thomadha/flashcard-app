import React, { useEffect, useState } from 'react';
import { useSetNames } from "./FetchFirestoreData";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { favoriteHandler, logButtonclick } from './GridHelper';
import starLogo from '../pictures/star.png';

export interface Item {
    id: string;
    name: string;
    creatorId: string;
    likes: number;
    tag: string;
    username: string
    isFavorite: boolean;
}


interface gridProps {
    filter: string;
    searchItem: string;
    page: number;
    tag: string;
}

const Grid: React.FC<gridProps> = ({ filter, searchItem, page, tag }) => {
    const navigateTo = useNavigate();
    const { flashcardSetData, fetchDataSetNames } = useSetNames();
    const [itemsArray, setItemsArray] = useState<Item[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState("");
    const starLogoUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' + starLogo + '</svg>');

// Then use `starLogoUrl` as the src of your <img> element


    useEffect(() => {
        fetchDataSetNames(filter, page);
    }, [filter, page]); // Fetch data when filter or page changes

    {/*useEffect(() => {
        const filtered = flashcardSetData.filter(item =>
            item.name.toLowerCase().startsWith(searchItem.toLowerCase()));
        
        let filteredByTag: { id: string; name: string; creatorId: string; likes:number; tag: string; username:string}[] = [];
        if (searchItem.trim() !== '') {
            // Only filter by tag if searchItem is not empty
            filteredByTag = flashcardSetData.filter(item =>
                item.tag && item.tag.toLowerCase().startsWith(searchItem.toLowerCase())
            );
        }
        const filteredResults = [...filtered, ...filteredByTag];
        setFilteredNameID(filteredResults);
        
        
    }, [searchItem, flashcardSetData]);*/}

    useEffect(() => {
        const getFilteredItemsArray =async () => {
            if (flashcardSetData) {
                const filtered = flashcardSetData.filter(item =>
                    item.name.toLowerCase().startsWith(searchItem.toLowerCase())
                )
                if (tag != ""){
                    const filtered2 = filtered.filter(item => item.tag === tag)
                    setItemsArray(filtered2);
                } else {
                    setItemsArray(filtered);
                }
            
            }
        }
        getFilteredItemsArray()
    }, [flashcardSetData, searchItem]);

    // SEARCH WITH TAG:
    useEffect(() => {
        const getTagItemsArray =async () => {
            if (flashcardSetData) {
                if (tag != ""){
                    const filtered = flashcardSetData.filter(item => item.tag === tag)
                    setItemsArray(filtered);
                } else {
                    fetchDataSetNames(filter, page)
                }
                
                
                
            }
        }
        getTagItemsArray()
    }, [tag]);

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
            setUserId(user.uid);
            const arrayRef = doc(db, "Administratorer", "UsersWithAdmin");
            const AdminArrayDoc = await getDoc(arrayRef);
            try {
                const Array = AdminArrayDoc.get("AdminArray").includes(mail);
                return Array;
            } catch (error) {
                return []
            }

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
                fetchDataSetNames(filter, page);
            }
        } catch (e) {
            return;
        }
    }

    //Håndterer når like knappen blir trykket på
    const changeLike = (itemId: string) => async (event: React.MouseEvent) => {
        event.stopPropagation();
        logButtonclick(itemId);
        fetchDataSetNames(filter, page);
    }

    //Håndterer når favoritt knappen blir trykket på
    const changeFavorite = (id: string) => (event: React.MouseEvent) => {
        event.stopPropagation();
        favoriteHandler(id);
        fetchDataSetNames(filter, page);
    }

    return (
        <div className="grid-container">
            {itemsArray.map((item) => (
                <div key={item.id} className="grid-item" onClick={() => gotoPage(item.id, item.creatorId)}>
                <div className='setTitle'>{item.name}</div>
                {(isAdmin || item.creatorId === userId) && (
                    <button onClick={gotoEdit(item.id)}>Rediger</button>
                )}
                {(isAdmin || item.creatorId === userId) && (
                    <button className="deleteButton" onClick={(event) => deleteSet(item.id)(event)}> Slett </button>
                )}
                {/* Render different favorite buttons based on the value of item.isFavorite */}
                {item.isFavorite ? (
                    (
                        <>
                        <div>
                            <button onClick={(event) => changeLike(item.id)(event)}>{item.likes} likerklikk</button>
                            <img src={starLogo} id='favoriteimage' onClick={(event) => changeFavorite(item.id)(event)} />
                        </div>
                        </>
                    )
                ) : (
                    <>
                    <div>
                        <button onClick={(event) => changeLike(item.id)(event)}>{item.likes} likerklikk</button>
                        <img src={starLogo} id='favoriteimagenot' onClick={(event) => changeFavorite(item.id)(event)} />
                    </div>
                    </>
                )}
                <p>Kategori: {item.tag}</p>
                <p style={{bottom:0}}>Laget av: {item.username}</p>
            </div>
            ))}
        </div>
    );
}

export default Grid;
