import { useState } from "react";
import properties from "./properties.json";
import "./App.css";

function App() {
  const [searchType, setSearchType] = useState("any");
  const [searchBedrooms, setSearchBedrooms] = useState("any");

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

      {/* Filter & Display Properties */}
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
          <div key={property.id} className="property-card">
            <h3>{property.title}</h3>
            <p>{property.shortDescription}</p>
            <p>Type: {property.type}</p>
            <p>Price: £{property.price}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Postcode: {property.postcode}</p>
            <p>Date Added: {property.dateAdded}</p>
            {property.images.length > 0 && (
              <img
                src={property.images[0]}
                alt={property.title}
              />
            )}
          </div>
        ))}
    </div>
  );
}

export default App;
