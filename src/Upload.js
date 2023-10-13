import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase'; // Import Firebase RTDB and Storage
import { set, ref as rtdbRef, push as rtdbPush} from 'firebase/database'; // Import RTDB functions
import 'firebase/compat/storage'; // Import Firebase Storage
import './Upload.css';

function Upload({ onChildUpload }) {
  const [childInfo, setChildInfo] = useState({
    name: '',
    age: '',
    gender: '',
    lastLocation: '',
    photoFile: null, // Store the selected file
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChildInfo({ ...childInfo, [name]: value });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setChildInfo({ ...childInfo, photoFile: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload the selected file to Firebase Storage
      if (childInfo.photoFile) {
        const storageRef = ref(storage, 'images/' + childInfo.photoFile.name);
        await uploadBytes(storageRef, childInfo.photoFile);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        const rtdbRefPath = `children`;
        const rtdbChildRef = rtdbPush(rtdbRef(db,rtdbRefPath));

        // Store child information in RTDB
        await set(rtdbChildRef, {
          name: childInfo.name,
          age: childInfo.age,
          gender: childInfo.gender,
          lastLocation: childInfo.lastLocation,
          photoURL: downloadURL, // Store the download URL in RTDB
        });
      }

      // Reset form
      setChildInfo({
        name: '',
        age: '',
        gender: '',
        lastLocation: '',
        photoFile: null, // Reset the file input
      });
    } catch (error) {
      console.error('Error uploading child info:', error);
    }
  };

  return (
    <div className='upload'>
    <div className='img-container'>
      <div className='overlay'></div>
      <img className='side-img' src='children.jpg'></img>
    </div>
    
    <div className="child-upload-form">

      <h2>Upload Missing Child Information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={childInfo.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="age"
          placeholder="Age"
          value={childInfo.age}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={childInfo.gender}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastLocation"
          placeholder="Last Location"
          value={childInfo.lastLocation}
          onChange={handleInputChange}
          required
        />
        <input
          type="file" // Use file input for file selection
          accept="image/*" // Accept image files
          onChange={handleFileInputChange}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
    </div>
  );
}

export default Upload;
