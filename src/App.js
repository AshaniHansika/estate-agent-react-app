import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import properties from "./properties.json";
import PropertyPage from "./PropertyPage";
import "./App.css";

const ITEM_TYPE = "PROPERTY";

/* ---------------- PROPERTY CARD ---------------- */
function PropertyCard({ property, onOpen, onAddFavourite }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { property },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div className="property-card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div
        ref={drag}
        style={{
          cursor: "grab",
          padding: "6px",
          border: "1px dashed #aaa",
          marginBottom: "10px",
          textAlign: "center",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
        }}
      >
        Drag to Favourites
      </div>

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
          onOpen(property.id);
        }}
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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [maxBedrooms, setMaxBedrooms] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [postcodeArea, setPostcodeArea] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [favourites, setFavourites] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => {
      const property = item.property;
      if (!favourites.find((f) => f.id === property.id)) {
        setFavourites((prev) => [...prev, property]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  /* PROPERTY PAGE */
  if (selectedPropertyId) {
    return (
      <PropertyPage
        propertyId={selectedPropertyId}
        onBack={() => setSelectedPropertyId(null)}
      />
    );
  }

  /* FILTER FUNCTION */
  const filterProperties = (property) => {
    // Type
    if (searchType !== "any" && property.type !== searchType) return false;

    // Bedrooms
    if (minBedrooms && property.bedrooms < Number(minBedrooms)) return false;
    if (maxBedrooms) {
      if (maxBedrooms === "5+" && property.bedrooms < 5) return false;
      if (maxBedrooms !== "5+" && property.bedrooms > Number(maxBedrooms))
        return false;
    }

    // Price
    if (minPrice && property.price < Number(minPrice)) return false;
    if (maxPrice && property.price > Number(maxPrice)) return false;

    // Date Added
    if (dateFrom && new Date(property.dateAdded) < new Date(dateFrom)) return false;
    if (dateTo && new Date(property.dateAdded) > new Date(dateTo)) return false;

    // Postcode Area
    if (postcodeArea && !property.postcode.toUpperCase().startsWith(postcodeArea.toUpperCase())) 
      return false;

    return true;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Estate Agent App</h1>

      <h2>Search Properties</h2>

      <form style={{ marginBottom: "20px" }}>
        {/* Type */}
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

        {/* Bedrooms */}
        <label>
          Min Bedrooms:
          <select
            value={minBedrooms}
            onChange={(e) => setMinBedrooms(e.target.value)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </label>
        <label>
          Max Bedrooms:
          <select
            value={maxBedrooms}
            onChange={(e) => setMaxBedrooms(e.target.value)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5+">5+</option>
          </select>
        </label>

        {/* Price */}
        <label>
          Min Price (£):
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />
        </label>
        <label>
          Max Price (£):
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />
        </label>

        {/* Date Added */}
        <label>
          Date From:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />
        </label>
        <label>
          Date To:
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />
        </label>

        {/* Postcode Area */}
        <label>
          Postcode Area:
          <input
            type="text"
            value={postcodeArea}
            onChange={(e) => setPostcodeArea(e.target.value)}
            placeholder="e.g. BR1, NW1"
            style={{ marginLeft: "10px" }}
          />
        </label>
      </form>

      <hr />

      {/* FAVOURITES */}
      <div
        ref={drop}
        className="favourites-zone"
        style={{
          border: "2px dashed #aaa",
          backgroundColor: isOver ? "#e6f7ff" : "#fafafa",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>Favourites (Drop Here)</h2>
        {favourites.length === 0 && <p>No favourites yet.</p>}
        {favourites.map((fav) => (
          <div key={fav.id} className="property-card">
            <h4>{fav.title}</h4>
            <button
              onClick={() =>
                setFavourites((prev) => prev.filter((f) => f.id !== fav.id))
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <hr />

      {/* SEARCH RESULTS */}
      <div className="results-grid">
        {properties.filter(filterProperties).map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onOpen={(id) => setSelectedPropertyId(id)}
            onAddFavourite={(prop) => {
              if (!favourites.find((f) => f.id === prop.id)) {
                setFavourites((prev) => [...prev, prop]);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
