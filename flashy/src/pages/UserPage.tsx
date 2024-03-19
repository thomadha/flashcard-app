import React from "react";
import NavBar from "../components/NavBar";
import AdminPanel from "../components/AdminPanel";
import UserPanel from "../components/UserPanel";

function UserPage(){
    return (
        <>
          <NavBar />
          <UserPanel />
          <AdminPanel />
        </>
    );
}

export default UserPage; 