import HomePageNav from "./HomePageNav";
import Navbar from "./NavBar";
import Grid from "./Grid";
import React, { useEffect, useState } from "react";


function HomePageParent() {

    const [page, setPage] = useState<number>(0);
    const updatePage = (pageNumber : number) => {
        setPage(pageNumber);
    }

    // Filter is a state that is changed based on what sets you want to be shown in the main page
    const [filter, setFilter] = useState<string>('');
    const [searchItem, setSearchItem] = useState<string>('');

    const [tag, setTag] = useState<string>('');

    return (
        <>
            <div id="homePageNav">
                <Navbar />
                <HomePageNav page={page} tag={tag} setTag={setTag} filter={filter} setFilter={setFilter} searchItem={searchItem} setSearchItem={setSearchItem} updatePage={updatePage}/>
                <Grid tag={tag} page={page} filter={filter} searchItem={searchItem}/>
            </div>
        </>
        )
}


export default HomePageParent