import React from 'react';
import DefaultIcon from '../../assets/user.png'

const SettingPage = () => {

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="grid flex-grow grid-cols-3 overflow-hidden border border-gray-300 rounded-lg">
        <div className="flex flex-col justify-between col-span-3 py-6 px-6">
          <div>
            <p className="text-gray-800 text-xl font-bold mb-6">User Profile</p>

            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full relative overflow-hidden">
                {/* Uncomment the Avatar Placeholder for visibility */}
                <img
                  src={DefaultIcon} // Replace with actual image path or dynamic avatar source
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />

                {/* Hover Button */}
                <button
                  className="avatar-button"
                  onClick={() => alert('Change Profile Picture')}
                >
                  Change
                </button>
              </div>
              <div>
                <p className="text-gray-800 text-lg font-semibold">Nickname</p>
                <p className="text-gray-600 text-sm">user.email@example.com</p>
              </div>
            </div>

            <div className="flex items-end border-b border-gray-300 gap-4 pb-6 mb-6">
              {/* Form Fields Placeholder */}
              <div className="grid flex-grow grid-cols-2 gap-4">
                {/* Example Input Fields */}
                <input type="text" className="border rounded px-3 py-2" placeholder="New Username" />
              </div>
              <button
                disabled
                className="bg-blue-500 text-white px-4 py-2 rounded w-1/4 disabled:bg-blue-300"
              >
                Save Changes
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-gray-800 text-md font-semibold">Password</p>
                <p className="text-gray-700 text-sm">Change My Password</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded w-1/4">
                Change Password
              </button>
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-300 pt-6 mt-6 gap-4">
            <div>
              <p className="text-gray-800 text-md font-semibold">Logout</p>
              <p className="text-gray-700 text-sm">Logout from PeerPrep</p>
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded w-1/4">
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
