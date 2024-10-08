import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { listTravelEntries } from './graphql/queries';
import { createTravelEntry as createTravelEntryMutation, deleteTravelEntry as deleteTravelEntryMutation } from './graphql/mutations';

const initialFormState = { destination: '', description: '', date: '' };

function App() {
  const [entries, setEntries] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const apiData = await API.graphql({ query: listTravelEntries });
    const entriesFromAPI = apiData.data.listTravelEntries.items;

    await Promise.all(entriesFromAPI.map(async entry => {
      if (entry.imageUrl) {
        const image = await Storage.get(entry.imageUrl);
        entry.image = image;
      }
      return entry;
    }));
    setEntries(entriesFromAPI);
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function createEntry() {
    if (!formState.destination || !formState.description || !formState.date) return;
    const newEntry = { ...formState };

    if (image) {
      const imageName = image.name;
      await Storage.put(imageName, image);
      newEntry.imageUrl = imageName;
    }

    await API.graphql({ query: createTravelEntryMutation, variables: { input: newEntry } });
    setEntries([...entries, newEntry]);
    setFormState(initialFormState);
  }

  async function deleteEntry({ id }) {
    const newEntriesArray = entries.filter(entry => entry.id !== id);
    setEntries(newEntriesArray);
    await API.graphql({ query: deleteTravelEntryMutation, variables: { input: { id } } });
  }

  return (
    <div className="App">
      <h1>My Travel Journal</h1>
      <input onChange={e => setInput('destination', e.target.value)} placeholder="Destination" value={formState.destination} />
      <textarea onChange={e => setInput('description', e.target.value)} placeholder="Description" value={formState.description} />
      <input type="date" onChange={e => setInput('date', e.target.value)} value={formState.date} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button onClick={createEntry}>Create Travel Entry</button>

      <div style={{ marginBottom: 30 }}>
        {
          entries.map(entry => (
            <div key={entry.id || entry.destination}>
              <h2>{entry.destination}</h2>
              <p>{entry.description}</p>
              <p>{entry.date}</p>
              {
                entry.image && <img src={entry.image} style={{ width: 400 }} alt="Travel" />
              }
              <button onClick={() => deleteEntry(entry)}>Delete entry</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
