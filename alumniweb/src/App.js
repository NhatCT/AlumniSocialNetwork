import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import "./App.css";

import { MyUserContext } from "./configs/Context";
import { useReducer } from "react";
import MyUserReducer from "./components/reducers/MyUserReducer";
import cookie from 'react-cookies';
import Profile from "./components/Profile";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import UsernameProfile from "./components/UsernameProfile";
import SurveyList from "./components/SurveyList";
import SurveyDetail from "./components/SurveyDetail";
import ChatPage from "./components/ChatPage";

const App = () => {
    const [user, dispatch] = useReducer(MyUserReducer, cookie.load('user') || null);
    const currentPath = window.location.pathname;
    const publicPaths = ["/login", "/register"];
    const shouldRedirect = !user && !publicPaths.includes(currentPath);

    return (
        <MyUserContext.Provider value={[user, dispatch]}>
            <BrowserRouter>
                {shouldRedirect && <Navigate to="/login" replace />}

                <div className="app-container">
                    <Header />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/posts" element={
                            <div className="app-main">
                                <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>
                                    <PostList />
                                </div>
                            </div>
                        } />
                        <Route path="/posts/:id" element={
                            <div className="app-main">
                                <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>
                                    <PostDetail />
                                </div>
                            </div>
                        } />
                        <Route path="/surveys" element={
                            <div className="app-main">
                                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
                                    <SurveyList />
                                </div>
                            </div>
                        } />
                        <Route path="/surveys/:id" element={
                            <div className="app-main">
                                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
                                    <SurveyDetail />
                                </div>
                            </div>
                        } />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={
                            <div className="app-main">
                                <Profile />
                            </div>
                        } />
                        <Route path="/profile/:username" element={
                            <div className="app-main">
                                <UsernameProfile />
                            </div>
                        } />
                        <Route path="/chat" element={
                            <div className="app-main">
                                <ChatPage />
                            </div>
                        } />
                    </Routes>

                    {/* Don't show footer on auth/chat pages */}
                    {user && currentPath !== '/chat' && <Footer />}
                </div>
            </BrowserRouter>
        </MyUserContext.Provider>
    );
};

export default App;
