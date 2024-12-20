import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const apiUrl = "https://xcountriesapi.onrender.com/all";

  // Fetch country data on initial load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();

        if (Array.isArray(data)) {
          setCountries(data);
          setFilteredCountries(data);  // Initial country set
        } else {
          throw new Error("Invalid API response format.");
        }
      } catch (err) {
        setError("Failed to fetch country data. Please try again later.");
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCountries(countries); // Reset to all countries if search is empty
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(term)
      );
      setFilteredCountries(filtered);
    }
  };

  return (
    <div className="App">
      <h1>Country Search</h1>

      {/* Search Input Field */}
      <input
        type="text"
        placeholder="Search countries"
        value={searchTerm}
        onChange={handleSearch}
        data-cy="search-input" // For Cypress testing
      />

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Loading Indicator */}
      {loading && <p>Loading countries...</p>}

      {/* No results message */}
      {!loading && !error && filteredCountries.length === 0 && (
        <p>No countries found.</p>
      )}

      {/* Display Country Cards */}
      <div className="countries-grid">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div key={country.abbr} className="countryCard" data-cy="country-card">
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="country-flag"
                data-cy="country-flag"
              />
              <p className="country-name" data-cy="country-name">
                {country.name}
              </p>
            </div>
          ))
        ) : (
          <p>No countries found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
