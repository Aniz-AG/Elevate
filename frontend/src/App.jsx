import { useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import {SignUpForm, LoginForm, ForgotPasswordForm } from './Components/auth';
import BlogPage from './Pages/BlogPage.jsx';
import Home from './Components/home';
import './index.css';
import Header from './Components/header';
import ProfilePage from './Components/profile';
import ChatSection from './Pages/ChatSection.jsx';
import { Chat } from '@mui/icons-material';
function App() {

  return (
    <div>
      <Header />      
      <Routes>
      <Route path="/signup" element={<SignUpForm />} />  
      <Route path="/login" element={<LoginForm />}  />  
      <Route path="/forgot-password" element={<ForgotPasswordForm />}  />
      <Route path="/home" element={<Home />} />
      <Route path="/blogs" element={<BlogPage />} />
      <Route path="/profile" element={<ProfilePage/ >} />
      <Route path="/explore" element={<ChatSection />}/>
      </Routes>   
    </div>
  )
}

export default App