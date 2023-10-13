import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { db,storage } from './firebase'; // Import Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions
import { getDatabase, ref as ref2,get} from 'firebase/database';

import './Find.css';
import Feed from './Feed';

function Find() {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [photoUrls,setPhotoUrls]=useState(['']);
  useEffect(() => {
    // Fetch photo URLs from Realtime Database using the useEffect hook
    const fetchPhotoUrls = async () => {
      try {
        const rtdbPhotoRef = ref2(getDatabase(), 'children'); // Replace 'children' with your RTDB reference path
        const dataSnapshot = await get(rtdbPhotoRef);
  
        if (dataSnapshot.exists()) {
          const data = dataSnapshot.val();
          const urls = [];
  
          // Assuming 'photoURL' is the field name in your RTDB data
          Object.values(data).forEach((childData) => {
            if (childData.photoURL) {
              urls.push(childData.photoURL);
            }
          });
          setPhotoUrls(urls);
        } else {
          console.error('No data found in RTDB.');
        }
      } catch (error) {
        console.error('Error fetching photo URLs from RTDB:', error);
      }
    };
  
    fetchPhotoUrls();
  }, []);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const scaleFactor = 1 / 5; // Scale down by a factor of 5
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const newWidth = img.width * scaleFactor;
          const newHeight = img.height * scaleFactor;

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          const scaledImageDataUrl = canvas.toDataURL('image/jpeg'); // Adjust format as needed

          setImagePreview(scaledImageDataUrl);
        };
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
      setFile(null);
    }
  };

  

  const handleSubmit = async () => {
    try {
      if (file) {
        const storageRef = ref(storage, 'testImage/' + file.name);
  
        // Upload the selected file to Firebase Storage
        await uploadBytes(storageRef, file);
  
        // Get the download URL for the uploaded file
        const downloadURL = await getDownloadURL(storageRef);
  
        console.log('Image uploaded successfully to Firebase Storage.');
        console.log('Download URL:', downloadURL);
  
        if (photoUrls.length === 0) {
          console.error('No photo URLs found in the RTDB.');
          return;
        }
  
        const apiResponses = [];
  
        // Iterate through photoUrls and make API calls
        for (const photoUrl of photoUrls) {
          try {
            const apiOptions = {
              method: 'POST',
              url: 'https://api.edenai.run/v2/image/face_compare', // Use the provided API endpoint
              headers: {
                Authorization: 'Bearer "you eden AI api key"', // Replace with your actual API key
  
              },
              data: {
                show_original_response: true,
                fallback_providers: "",
                providers: "amazon",
                file1_url: downloadURL,
                file2_url: photoUrl,
              },
            };
  
            const response = await axios.request(apiOptions);
  
            if (response.status === 200) {
              const responseData = response.data;
              apiResponses.push(responseData.amazon.original_response.FaceMatches);
              console.log(`API Response for ${photoUrl}:`, responseData);
            } else {
              console.error(`API request failed for ${photoUrl} with status: ${response.status}`);
            }
          } catch (error) {
            console.error(`Error making API request for ${photoUrl}:`, error);
          }
        }
  
        // Now you have an array of API responses in apiResponses
        console.log('API Responses:', apiResponses);
      } else {
        console.error('No file selected for upload.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  

  const cancelImage=()=>{
    setImagePreview(null);
  }

  return (
    <div className='Find'>
      {imagePreview ? (
        <div className='container'>
          <div className='container-em'>
            <img src={imagePreview} alt="Preview" id='previewImg'/>
          </div>
          <div className='container-em'>
            <button type='button' className='submitImage' onClick={handleSubmit}>
              Submit
            </button>
            <button type='button' className='cancelImage' onClick={cancelImage}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className='container'>
          <div className='container-em'>
          <h2>Upload to find.</h2>
            <img src='file.png' id='demo-img' alt="img" />
          </div>
          <div className='container-em'>
            <input
              className='initialDiv'
              type="file"
              id="upload-image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Find;
