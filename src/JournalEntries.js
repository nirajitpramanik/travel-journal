// src/JournalEntries.js
import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { listJournalEntries } from './graphql/queries';

const JournalEntries = () => {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    const entryData = await API.graphql({ query: listJournalEntries });
    setEntries(entryData.data.listJournalEntries.items);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.title}</h3>
          <p>{entry.content}</p>
          <p>{entry.date}</p>
          {entry.imageUrl && (
            <img src={`https://traveljournal84db5989208d4f25800f44adde11050a61c0e-dev.s3.amazonaws.com/${entry.imageUrl}`} alt={entry.title} />
          )}
        </div>
      ))}
    </div>
  );
};

export default JournalEntries;
