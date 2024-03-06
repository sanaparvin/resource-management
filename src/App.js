import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Upload from "./pages/uploads/uploads";
import Profile from "./pages/profile/profile";
import Admin from "./pages/admin/admin";
import Moderator from "./pages/moderator/moderator";

const App = () => {
    const isAuthenticated = () => {
        // Check if the user ID is stored in the session
        return sessionStorage.getItem("uid") !== null;
    };

    return ( <
        Router >
        <
        Routes >
        <
        Route path = "/"
        element = { < Navigate to = "/login"
            replace / > }
        /> <
        Route path = "/home"
        element = { isAuthenticated() ? < Home / > : < Navigate to = "/login"
            replace / > }
        /> <
        Route path = "/profile"
        element = { isAuthenticated() ? < Profile / > : < Navigate to = "/login"
            replace / > }
        /> <
        Route path = "/uploads"
        element = { isAuthenticated() ? < Upload / > : < Navigate to = "/login"
            replace / > }
        /> <
        Route path = "/admin"
        element = { isAuthenticated() ? < Admin / > : < Navigate to = "/login"
            replace / > }
        /> <
        Route path = "/moderator"
        element = { isAuthenticated() ? < Moderator / > : < Navigate to = "/login"
            replace / > }
        /> <
        Route path = "/login"
        element = { < Login / > }
        /> <
        /Routes> <
        /Router>
    );
};

export default App;