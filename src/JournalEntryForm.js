// src/JournalEntryForm.js
import React, { useState } from 'react';
import { API, Storage } from 'aws-amplify';
import { createJournalEntry } from './graphql/mutations';

const JournalEntryForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Upload image to S3 if selected
    let imageUrl = null;
    if (image) {
      const uploadedImage = await Storage.put(image.name, image);
      imageUrl = uploadedImage.key; // Store the image key in DynamoDB
    }

    const journalEntry = {
      title,
      content,
      date: new Date().toISOString(),
      imageUrl,
    };

    await API.graphql({
      query: createJournalEntry,
      variables: { input: journalEntry },
    });

    // Reset the form
    setTitle('');
    setContent('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Add Entry</button>
    </form>
  );
};

export default JournalEntryForm;
