import { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './App.css';
import apiData from './data/data-example.json';

import TicketToggle from './assets/ticket-toggle.svg?react';
import StarToggle from './assets/star-toggle.svg?react';

// helper functions for EventStub and MainContent components
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true};
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', 'th,')
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatTaxonomy(taxonomy) {
  const acronyms = ['nhl', 'nba', 'nfl', 'ncaa', 'mls'];
  return taxonomy
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => acronyms.includes(word.toLowerCase()) ? word.toUpperCase() : capitalize(word))
    .join(' ');
}

function EventStub({ event, isStarred, onToggleStar, onSelectEvent }) {
  // string formatting
  const formattedDate = formatDate(event.datetime_local);
  const formattedTaxonomy = formatTaxonomy(event.taxonomies[event.taxonomies.length - 1].name);

  return (
    <div className='event-stub' onClick={onSelectEvent}>
      <h5>{event.short_title}</h5>
      <div className='event-stub-container'>
        <ul className='stub-left'>
          <li>{formattedTaxonomy}</li>
          <li>{formattedDate}</li>
          <li>{event.venue.name}</li>
        </ul>
        <div className='stub-right'>
          <div className={`star-icon ${isStarred ? 'filled' : ''}`} onClick={onToggleStar}>
            <StarToggle />
          </div>
          <div className='ticket-icon'>
            <TicketToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchBar({ filterText, onFilterTextChange }) {
  return (
    <form className='search-bar'>
      <input 
        className='search-input'
        type='text'
        value={filterText} 
        placeholder='Search...'
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
    </form>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className='nav-left'>
        <Link exact='true' to="/" className='nav-link'>Tickets</Link>
        <Link to="/" className='nav-link'>Clients</Link>
        <Link to="/" className='nav-link'>Calendar</Link>
      </div>
      <div className='nav-right'>
        <Link to='/' className='nav-link'>Profile</Link>
      </div>
    </nav>
  );
}

function MainContent({ event }) {
  if (!event) {
    return (
      <div className='main-content'>
        <h1>Main Content</h1>
        <h3>Select something...</h3>
        <p>to see cool stuff</p>
      </div>
    );
  }

  const yelpString = `https://www.yelp.com/search?find_desc=restaurants+%26+bars&find_loc=${event.venue.location.lat ?? ''}%2C+${event.venue.location.lon ?? ''}`
  return (
    <div className='main-content'>
      <div className='main-text'>
        <h1>{event.title}</h1>
        <h3>{formatDate(event.datetime_local)}</h3>
        <h4>{event.venue.name}</h4>
        <p>{event.venue.address}</p>
        <p>{event.venue.city}, {event.venue.state} {event.venue.postal_code}</p>
      </div>
      <div className='main-content-extras'>
        <img src={event.performers[0].image}></img>
        <div className='yelp-search'>
            <a href={yelpString} target='blank' rel='noopener noreferrer'>
              <img src='../yelp_burst.png' alt='yelp!'></img>
              <span>
                Find local bars & restaurants
              </span>
            </a>
        </div>
      </div>
      <div className='interactive-buttons'>
        <button type='button'>Request Tickets</button>
        <button type='button'>Invite</button>
        <button type='button'>Share</button>
      </div>
    </div>
  );
}

const FilterableEventsPage = ({ events }) => {
  const [filterText, setFilterText] = useState('');
  const [starredEvents, setStarredEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const filteredEvents = events.filter((event) => {
    return event.short_title.toLowerCase().includes(filterText.toLowerCase());
  })

  return (
    <div className='App'>
      <Navbar />
      <div className='tickets-container'>
        <div className='sidebar'>
          <SearchBar
            filterText={filterText}
            onFilterTextChange={setFilterText}
          />
          {filteredEvents.map((event) => (  // for filtered events create EventStubs
            <EventStub 
              key={event.id} 
              event={event} 
              isStarred={starredEvents[event.id]}  // pass down starred state for each event
              className='event-stub' 
              onToggleStar={() => {
                setStarredEvents(prev => ({
                  ...prev,
                  [event.id]: !prev[event.id]  // Toggle the starred state for the event
                }))
              }}
              onSelectEvent={() => handleSelectEvent(event)}
            />
          ))}
        </div>
        <MainContent event={selectedEvent}/>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <FilterableEventsPage events={apiData.events} />
    </Router>
  )
}