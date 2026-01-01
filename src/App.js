import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import properties from "./properties.json";
import PropertyPage from "./PropertyPage";
import "./App.css";

const ITEM_TYPE = "PROPERTY";

/* ---------------- PROPERTY CARD (DRAG SOURCE) ---------------- */
function PropertyCard({ property, onOpen, onAddFavourite }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: property,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="property-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddFavourite(property);
        }}
      >
        Add to Favourites
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        style={{ marginLeft: "10px" }}
      >
        View Details
      </button>

      <h3>{property.title}</h3>
      <p>{property.shortDescription}</p>
      <p>Type: {property.type}</p>
      <p>Price: £{property.price}</p>
      <p>Bedrooms: {property.bedrooms}</p>

      {property.images.length > 0 && (
        <img src={property.images[0]} alt={property.title} />
      )}
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
function App() {
  const [searchType, setSearchType] = useState("any");
  const [searchBedrooms, setSearchBedrooms] = useState("any");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [favourites, setFavourites] = useState([]);

  /* -------- DROP TARGET (FAVOURITES) -------- */
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (property) => {
      if (!favourites.find((f) => f.id === property.id)) {
        setFavourites([...favourites, property]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

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

      <label>
        Type:
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ marginLeft: "10px", marginRight: "20px" }}
        >
          <option value="any">Any</option>
          <option value="house">House</option>
          <option value="flat">Flat</option>
        </select>
      </label>

      <label>
        Bedrooms:
        <select
          value={searchBedrooms}
          onChange={(e) => setSearchBedrooms(e.target.value)}
          style={{ marginLeft: "10px" }}
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

      {/* ⭐ FAVOURITES DROP ZONE */}
      <div
        ref={drop}
        style={{
          padding: "15px",
          border: "2px dashed #aaa",
          backgroundColor: isOver ? "#e6f7ff" : "#fafafa",
        }}
      >
        <h2>Favourites (Drop Here)</h2>

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
      </div>

      <hr />

      {/* 🔍 SEARCH RESULTS */}
      <div className="results-grid">
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
          <PropertyCard
            key={property.id}
            property={property}
            onOpen={() => setSelectedPropertyId(property.id)}
            onAddFavourite={(prop) => {
              if (!favourites.find((f) => f.id === prop.id)) {
                setFavourites([...favourites, prop]);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
