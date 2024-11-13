import React, { useContext,useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../Context/DataContext';
import api from '../api/api';
const Header = () => {
  const navigate = useNavigate();
  const { loggedIn, logout, userInfo } = useContext(DataContext);
  const [profileImage,setProfileImage]=useState('');
  useEffect(()=>{
    const fetchUserData = async () => {
      try{
      const response = await api.get("/users/profile/get-user-profile");
      const photoPath = response.data.profilePhoto;
      const fullPhotoUrl = `http://localhost:8000/${photoPath}`;
      setProfileImage(fullPhotoUrl);
      }catch(err)
      {
        console.log('Error fetching profile',err);
      }
    }
    fetchUserData();
  },[])
 
  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg font-poppins">
      {/* Logo */}
      <div
        className="text-2xl font-bold cursor-pointer transition-colors duration-300 hover:text-teal-500"
        onClick={() => navigate('/home')}
      >
        ELEVATE
      </div>

      {/* Navigation Links */}
      <nav>
        <div className="flex space-x-6">
          {['Blogs', 'Explore', 'About Us'].map((item) => (
            <div
              key={item}
              className="hover-1 hover-1 text-sm md:text-base font-bold cursor-pointer px-2 py-1 transition-transform duration-400 hover:underline"
              onClick={() => navigate(`/${item.toLowerCase().replace(' ', '-')}`)}
            >
              {item}
            </div>
          ))}
        </div>
      </nav>

      {/* User Info or Authentication Buttons */}
      <div className="flex space-x-4">
        {!loggedIn ? (
          <>
            <button
              className="py-2 px-4 text-sm md:text-base font-semibold bg-blue-500 text-white rounded-md hover:scale-105 transition-transform duration-200"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="py-2 px-4 text-sm md:text-base font-semibold border-2 border-blue-500 text-blue-500 rounded-md hover:scale-105 transition-transform duration-200"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <button
              className="py-2 px-4 text-sm md:text-base font-semibold bg-red-500 text-white rounded-md hover:scale-105 transition-transform duration-200"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
            {userInfo?.name && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                <img
                  alt={userInfo.name}
                  src={profileImage || '/default-avatar.png'}
                  className="w-10 h-10 rounded-full border-2 border-white transition-transform duration-200 hover:scale-110"
                />
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
