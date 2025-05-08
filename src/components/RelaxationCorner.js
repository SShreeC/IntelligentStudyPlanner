// import React, { useState } from 'react';
// import './relax.css';
// const RelaxationCorner = () => {
//   const [searchQuery, setSearchQuery] = useState('');

//   // Function to handle form submission
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery) {
//       const formattedQuery = searchQuery.split(' ').join('+'); // Replace spaces with '+'
//       const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${formattedQuery}`;
//       window.location.href = youtubeSearchUrl; // Redirect to YouTube with the search query
//     } else {
//       alert('Please enter a topic to search!');
//     }
//   };

//   return (
//     <div className="relaxation-corner">
//       <h2>Relaxation Corner</h2>
//       <form onSubmit={handleSearch}>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Enter a topic (e.g., yoga, meditation)"
//         />
//         <button type="submit">Search</button>
//       </form>
//     </div>
//   );
// };

// export default RelaxationCorner;
import React, { useState } from 'react';
import './relax.css';

const RelaxationCorner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState(''); // To store the user choice

  // Handle form submission based on user selection
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery || !searchType) {
      alert('Please enter a search topic and select a category!');
      return;
    }

    const formattedQuery = searchQuery.split(' ').join('+'); // Replace spaces with '+'

    if (searchType === 'videos') {
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${formattedQuery}`;
      window.location.href = youtubeSearchUrl;
    } else if (searchType === 'games') {
      const kibaGamesSearchUrl = `https://www.kibagames.com/Seek/${formattedQuery}`;
      window.location.href = kibaGamesSearchUrl;
    }
  };

  return (
    <div className="relaxation-corner">
      {/* <h2>Relaxation Corner</h2> */}
      <form onSubmit={handleSearch}>
        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="">-- Select Category --</option>
          <option value="videos">Videos/Songs</option>
          <option value="games">Games</option>
        </select>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter your topic (e.g., yoga, driving)"
        />

        <button  className="btn btn-outline btn-info" type="submit">Search</button>
      </form>
    </div>
  );
};

export default RelaxationCorner;
