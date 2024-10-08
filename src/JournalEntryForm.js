// src/JournalEntryForm.js
import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createJournalEntry } from './graphql/mutations';
import './JournalEntryForm.css';

const client = generateClient();

const JournalEntryForm = ({ onNewEntry, user }) => { // Make sure to pass user prop
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tripDate, setTripDate] = useState(''); // State for trip date

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const journalEntry = {
      title,
      content,
      date: new Date().toISOString(),
      tripDate, // Ensure this is set properly
      owner: user?.username // Set the owner field (ensure user is defined)
    };
  
    try {
      const result = await client.graphql({
        query: createJournalEntry,
        variables: { input: journalEntry },
      });
  
      // Clear the form fields
      setTitle('');
      setContent('');
      setTripDate(''); // Reset trip date
      
      // Notify the parent component about the new entry
      onNewEntry(result.data.createJournalEntry); 
    } catch (error) {
      console.error('Error creating journal entry: ', error);
    }
  };  

  return (
    <form onSubmit={handleSubmit} className="journal-entry-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="form-input"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="form-textarea"
      />
      <input
        type="date"
        placeholder="Trip Date"
        value={tripDate}
        onChange={(e) => setTripDate(e.target.value)}
        required
        className="form-input"
      />
      <button type="submit" className="form-submit-button">Add Entry</button>
    </form>
  );
};

export default JournalEntryForm;
