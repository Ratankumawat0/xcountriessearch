import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        console.log("Fetching country data...");
        const response = await fetch("https://xcountriesapi.onrender.com/all");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();

        if (Array.isArray(data)) {
          setCountries(data);
          setFilteredCountries(data);
        } else {
          throw new Error("Invalid API response format.");
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to fetch country data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCountries(countries);
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

      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading countries...</p>}

      {!loading && !error && filteredCountries.length === 0 && (
        <p>No countries found.</p>
      )}

      <div className="countries-grid">
        {filteredCountries.map((country) => (
          <div key={country.abbr} className="country-card">
            <img
              src={country.flag}
              alt={`${country.name} flag`}
              className="country-flag"
            />
            <p className="country-name">{country.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
