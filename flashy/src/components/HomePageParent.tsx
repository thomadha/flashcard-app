import HomePageNav from "./HomePageNav";
import Navbar from "./NavBar";
import Grid from "./Grid";
import React, { useEffect, useState } from "react";

function HomePageParent() {
  // Filter is a state that is changed based on what sets you want to be shown in the main page
  const [filter, setFilter] = useState<string>("");
  const [searchItem, setSearchItem] = useState<string>("");

  return (
    <>
      <div>
        <Navbar />
        <HomePageNav
          filter={filter}
          setFilter={setFilter}
          searchItem={searchItem}
          setSearchItem={setSearchItem}
        />
        <div>
          <Grid filter={filter} searchItem={searchItem} />
        </div>
      </div>
    </>
  );
}

export default HomePageParent;
