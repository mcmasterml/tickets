import { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './App.css';
import apiData from './data/data-example.json';

const FilterableEventsPage = ({ events }) => {
  const [filterText, setFilterText] = useState('');

  const filteredEvents = events.filter((event) => {
    return event.short_title.toLowerCase().includes(filterText.toLowerCase());
  })

  return (
    <div>
      <SearchBar
        filterText={filterText}
        onFilterTextChange={setFilterText}
      />
      {filteredEvents.map((event) => (  // for filtered events create EventStubs
        <EventStub className='event-stub' key={event.id} event={event} />
      ))}
    </div>
  )
}

function SearchBar({ filterText, onFilterTextChange }) {
  return (
    <form>
      <input 
        type='text'
        value={filterText} 
        placeholder='Search...'
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
    </form>
  );
}

function EventStub({ event }) {
  return (
    <div className='event-stub'>
      <h5>{event.short_title}</h5>
      <ul>
        <li>{event.taxonomies[event.taxonomies.length - 1].name}</li>
        <li>{event.datetime_local}</li>
        <li>{event.venue.name}</li>
      </ul>
    </div>
  )
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className='nav-left'>
        <Link exact='true' to="/" className='nav-link'>Search Tickets</Link>
        <Link to="/mytickets" className='nav-link'>My Tickets</Link>
      </div>
      <div className='nav-right'>
        <Link to='/' className='nav-link'>Tickets</Link>
      </div>
    </nav>
  );
}

function Sidebar() {
  return (
    <div className='sidebar'>
      <FilterableEventsPage events={apiData.events} />
    </div>
  )
}

function MainContent() {
  return (
    <div className='main-content'>
      <h1>Main Content</h1>
      <h3>Select something...</h3>
      <p>to see cool stuff</p>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='tickets-container'>
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </Router>
  )
}