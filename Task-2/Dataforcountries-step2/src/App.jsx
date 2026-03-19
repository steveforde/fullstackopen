import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchItem.trim() === "") {
      setCountries([]);
      setSelectedCountry(null);
      setError("");
      return;
    }

    const fetchCountries = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${searchItem}`,
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCountries(response.data);
        } else {
          setCountries([]);
          setError("No countries found");
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
        setCountries([]);
        setError("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCountries, 500);
    return () => clearTimeout(timeoutId);
  }, [searchItem]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Country Finder</h1>

      <div>
        Find countries:{" "}
        <input
          type="text"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          placeholder="Enter country name"
        />
      </div>

      {searchItem === "" && <p>Type a country name to start searching</p>}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && countries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {!loading &&
        !error &&
        countries.length <= 10 &&
        countries.length > 1 &&
        countries.map((country) => (
          <p key={country.cca3}>
            {country.name.common}{" "}
            <button onClick={() => setSelectedCountry(country)}>Show</button>
          </p>
        ))}

      {!loading && !error && (countries.length === 1 || selectedCountry) && (
        <div>
          <h2>{(selectedCountry || countries[0]).name.common}</h2>
          <p>
            Capital: {(selectedCountry || countries[0]).capital?.[0] || "N/A"}
          </p>
          <p>Area: {(selectedCountry || countries[0]).area} km²</p>

          <h3>Languages:</h3>
          <ul>
            {((selectedCountry || countries[0]).languages
              ? Object.values((selectedCountry || countries[0]).languages)
              : ["N/A"]
            ).map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>

          <img
            src={(selectedCountry || countries[0]).flags?.png}
            alt={`${(selectedCountry || countries[0]).name.common} flag`}
            width="160"
          />
        </div>
      )}
    </div>
  );
};

export default App;
