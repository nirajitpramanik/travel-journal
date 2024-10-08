// src/JournalEntries.js
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listJournalEntries } from './graphql/queries';
import { deleteJournalEntry } from './graphql/mutations'; // Ensure this import is present
import './JournalEntries.css';

const client = generateClient();

const JournalEntries = ({ newEntry, user }) => { // Ensure user is passed in props
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const entryData = await client.graphql({ query: listJournalEntries });
      setEntries(entryData.data.listJournalEntries.items);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (newEntry) {
      setEntries((prevEntries) => [newEntry, ...prevEntries]);
    }
  }, [newEntry]);

  const handleDelete = async (id) => {
    try {
      await client.graphql({
        query: deleteJournalEntry,
        variables: { input: { id } },
      });
      setEntries(entries.filter((entry) => entry.id !== id)); // Remove the deleted entry from state
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="journal-entries">
      {entries.map((entry) => (
        <div key={entry.id} className="journal-entry">
          <h3>{entry.title}</h3>
          <p>{entry.content}</p>
          <p className="entry-trip-date">Trip Date: {new Date(entry.tripDate).toLocaleDateString()}</p> {/* Show trip date */}
          <p className="entry-date">{new Date(entry.date).toLocaleString()}</p>
          <button onClick={() => handleDelete(entry.id)} className="delete-button">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default JournalEntries;
