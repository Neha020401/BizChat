import React from 'react'
import { useAuth } from '../context/AuthContext';

export const EditProfilePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div>
        hello their 
      </div>
<div>
{
(user?.profileImage)?
    <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
:
    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
      <span className="text-gray-500">No Image</span>
    </div>
}

<div>
  User Name : 
 <div>
  <input type="text" value={user?.name} onChange={(e) => setUser({...user, name: e.target.value})} />
  </div> 
  
</div>
<div>
  User Email : {user?.email}
</div>
<div>
  User Role : {(user?.role) === 'SELLER' ? 'Seller' : (user?.role) === 'BUYER' ? 'Buyer' : 'Union'}
</div>
</div>

    </div>
  )
}


export default EditProfilePage