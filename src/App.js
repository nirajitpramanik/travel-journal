// src/App.js
import React from 'react';
import JournalEntryForm from './JournalEntryForm';
import JournalEntries from './JournalEntries';
import './App.css'; // You can style your components here

function App() {
  return (
    <div className="App">
      <h1>Travel Journal</h1>
      <JournalEntryForm />
      <JournalEntries />
    </div>
  );
}

export default App;
