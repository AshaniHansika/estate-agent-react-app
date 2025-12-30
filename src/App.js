import { useState } from "react";
import properties from "./properties.json";

function App() {
  const [searchType, setSearchType] = useState("any");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Estate Agent App</h1>

      <h2>Search Properties</h2>

      <label>
        Property Type:{""}
        <select
          style={{margineLeft: "10px"}}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="any">Any</option>
          <option value="house">House</option>
          <option value="flat">Flat</option>
        </select>
      </label>

      <hr />

      {properties
        .filter((property) =>
          searchType === "any" ? true : property.type === searchType
        )
        .map((property) => (

        <div
          key={property.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "15px",
            padding: "10px",
          }}
        >
          <h3>{property.title}</h3>
          <p>{property.shortDescription}</p>
          <p>Type: {property.type}</p>
          <p>Price: £{property.price}</p>
          <p>Bedrooms: {property.bedrooms}</p>
          <p>Postcode: {property.postcode}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
