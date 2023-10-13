import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, onValue, off, push, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, db, storage } from './firebase'; // Import 'app' from your firebase.js file
import './Feed.css';

function Feed() {
  const [feedEntries, setFeedEntries] = useState([]);
  const [scrollingInterval, setScrollingInterval] = useState(null);

  const handleChildUpload = async (childInfo) => {
    try {
      // Handle file upload to Firebase Storage
      const storageReference = storageRef(storage, `child_photos/${childInfo.photoFile.name}`);
      await uploadBytes(storageReference, childInfo.photoFile);

      // Get the download URL for the uploaded file
      const photoURL = await getDownloadURL(storageReference);

      // Create a new entry with child information
      const newEntry = {
        id: Date.now(),
        ...childInfo,
        photo: photoURL, // Set the photo URL to the download URL
      };

      // Push the child information as a JSON object to Firebase
      const childEntriesRef = ref(db, 'childEntries');
      const newChildRef = push(childEntriesRef);
      set(newChildRef, newEntry);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const scrollingFeedRef = useRef(null);

  useEffect(() => {
    const childEntriesRef = ref(db, 'children');

    const onDataChange = (snapshot) => {
      const entries = [];
      snapshot.forEach((childSnapshot) => {
        entries.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setFeedEntries(entries.reverse()); // Reverse the array to display the latest entries first
    };

    onValue(childEntriesRef, onDataChange);

    const scrollingFeed = scrollingFeedRef.current;
    let scrollPosition = 0;

    // Scroll the feed continuously
    const scrollFeed = () => {
      if (scrollPosition >= scrollingFeed.scrollHeight - scrollingFeed.clientHeight) {
        scrollPosition = 0;
      }
      scrollingFeed.scrollTop = scrollPosition;
      scrollPosition += 1;
    };

    // Start scrolling the feed
    const scrollInterval = setInterval(scrollFeed, 10);

    return () => {
      off(childEntriesRef, 'value', onDataChange);
      clearInterval(scrollInterval);
    };
  }, []);
  return (
    <div className="feed">
     <div className='feed-head'>
     <h1 id='scrolling-header'>Recently missing</h1>
     </div>
      <div className="scrolling-feed" ref={scrollingFeedRef}>
      
        {feedEntries.map((entry) => (
          <div className="feed-entry" key={entry.id}>
            <h2>{entry.name}</h2>
            <p>Age: {entry.age}</p>
            <p>Gender: {entry.gender}</p>
            <p>Last Location: {entry.lastLocation}</p>
            <img src={entry.photoURL} alt={entry.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
