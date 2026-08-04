  import React from 'react'
  import { useAuth } from '../context/AuthContext';
  import { useState } from 'react';

  export const EditProfilePage = () => {
    const { user } = useAuth();

  const [formData, setFormData] = useState({
  userName: user?.name || "",
    avatar: user?.avatar || null,
    email: user?.email || "",
    phone: user?.phone || "",
    name: user?.name || "",
    role: user?.role || "",
    bio: user?.bio || "",
});


const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
  })
}
const handleImageChange = (e) => {
  const validTypes = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
  if(e.target.files && e.target.files.length > 0){
    const file = e.target.files[0];
    if(validTypes.includes(file.type)){
      convertToBase64(file).then((base64) => {
        setFormData({ ...formData, avatar: base64 });
      });
    }
  }
}


    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div>
          {
            (user?.avatar) ?
              <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              :
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
          }
        
        <div>
          Change Profile Image :
            <input 
            type="file"
             accept="image/*"
             className='border-2'
             onChange = {handleImageChange}
               />
        </div>
          <div>
            User Name :
              <input 
              type="text" 
               className='border-2'
              value={formData.userName}
               onChange={(e) => 
               setFormData({ ...formData, userName: e.target.value })}
                />
          </div>
          <div>
            User Email : <input type="email"  className='border-2'  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            User Role : 
            <select id='option' value={formData.role} className='border-2' onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="SELLER">Seller</option>
              <option value="BUYER">Buyer</option>
              <option value="UNION">Union</option>
            </select>
            {/* {(user?.role) === 'SELLER' ? 'Seller' : (user?.role) === 'BUYER' ? 'Buyer' : 'Union'} */}
          </div>
          <div>
            User Phone : <input type="text"  className='border-2' value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          <div>
            User Bio : <textarea value={formData.bio} className='border-2' onChange={(e) => setFormData({ ...formData, bio: e.target.value })}></textarea>
          </div>
        </div>

      </div>
    )
  }


  export default EditProfilePage