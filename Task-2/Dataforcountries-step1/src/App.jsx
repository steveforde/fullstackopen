import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchItem.trim() === "") {
      setCountries([]);
      return;
    }

    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${searchItem}`,
        );

        if (response.data.length) {
          setCountries(response.data);
        } else {
          setCountries([]);
          console.error("No countries found for query");
        }
      } catch (error) {
        setCountries([]);
        console.error("Error fetching countries:", error);
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
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </div>

      {loading && <p>Searching...</p>}

      <div style={{ marginTop: "20px" }}>
        {!loading && countries.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {!loading &&
          countries.length <= 10 &&
          countries.length > 1 &&
          countries.map((country) => (
            <p key={country.cca3}>{country.name.common}</p>
          ))}

        {!loading && countries.length === 1 && (
          <div>
            <h2>{countries[0].name.common}</h2>
            <p>Capital: {countries[0].capital?.[0] || "N/A"}</p>
            <p>Area: {countries[0].area}</p>

            <h3>Languages:</h3>
            <ul>
              {countries[0].languages ? (
                Object.values(countries[0].languages).map((lang) => (
                  <li key={lang}>{lang}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>

            <img src={countries[0].flags?.png} alt="flag" width="160" />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
