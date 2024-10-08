// src/App.js
import React, { useState } from 'react';
import JournalEntryForm from './JournalEntryForm';
import JournalEntries from './JournalEntries';
import './App.css'; // Ensure to import your CSS file

const App = ({ signOut, user }) => {
  const [newEntry, setNewEntry] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to your journal, {user.username}</h1>
        <div className="navbar">
          <a href="/welcome" className="nav-link">Home</a>
          <button className="sign-out-button" onClick={signOut}>Sign Out</button>
        </div>
      </header>
      <main>
        <JournalEntryForm onNewEntry={setNewEntry} user={user} />
        <JournalEntries newEntry={newEntry} user={user} />
      </main>
    </div>
  );
};

export default App;
