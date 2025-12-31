import { useState } from "react";
import properties from "./properties.json";
import PropertyPage from "./PropertyPage";
import "./App.css";

function App() {
  const [searchType, setSearchType] = useState("any");
  const [searchBedrooms, setSearchBedrooms] = useState("any");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [favourites, setFavourites] = useState([]);

  // If a property is selected, show the Property Page
  if (selectedPropertyId) {
    return (
      <PropertyPage
        propertyId={selectedPropertyId}
        onBack={() => setSelectedPropertyId(null)}
      />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Estate Agent App</h1>

      <h2>Search Properties</h2>

      {/* Property Type Filter */}
      <label>
        Type:{" "}
        <select
          style={{ marginLeft: "10px", marginRight: "20px" }}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="any">Any</option>
          <option value="house">House</option>
          <option value="flat">Flat</option>
        </select>
      </label>

      {/* Bedrooms Filter */}
      <label>
        Bedrooms:{" "}
        <select
          style={{ marginLeft: "10px" }}
          value={searchBedrooms}
          onChange={(e) => setSearchBedrooms(e.target.value)}
        >
          <option value="any">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5+">5+</option>
        </select>
      </label>

      <hr />

      {/* 🔵 FAVOURITES SECTION */}
      <h2>Favourites</h2>

      {favourites.length === 0 && <p>No favourites yet.</p>}

      {favourites.map((fav) => (
        <div key={fav.id} className="property-card">
          <h4>{fav.title}</h4>
          <button
            onClick={() =>
              setFavourites(favourites.filter((f) => f.id !== fav.id))
            }
          >
            Remove
          </button>
        </div>
      ))}

      <hr />

      {/* 🔵 SEARCH RESULTS */}
      {properties
        .filter((p) => (searchType === "any" ? true : p.type === searchType))
        .filter((p) =>
          searchBedrooms === "any"
            ? true
            : searchBedrooms === "5+"
            ? p.bedrooms >= 5
            : p.bedrooms === Number(searchBedrooms)
        )
        .map((property) => (
          <div
            key={property.id}
            className="property-card"
            onClick={() => setSelectedPropertyId(property.id)}
            style={{ cursor: "pointer" }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!favourites.find((f) => f.id === property.id)) {
                  setFavourites([...favourites, property]);
                }
              }}
            >
              Add to Favourites
            </button>

            <h3>{property.title}</h3>
            <p>{property.shortDescription}</p>
            <p>Type: {property.type}</p>
            <p>Price: £{property.price}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Postcode: {property.postcode}</p>
            <p>Date Added: {property.dateAdded}</p>

            {property.images.length > 0 && (
              <img src={property.images[0]} alt={property.title} />
            )}
          </div>
        ))}
    </div>
  );
}

export default App;
