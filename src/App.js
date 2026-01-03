import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import properties from "./properties.json";
import PropertyPage from "./PropertyPage";
import "./App.css";

const ITEM_TYPE = "PROPERTY";

/* ---------------- PROPERTY CARD ---------------- */
function PropertyCard({ property, onOpen, onAddFavourite, favourites }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { property },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const isAdded = favourites.some((f) => f.id === property.id);

  return (
    <div
      className="property-card"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "pointer" }}
      onClick={() => onOpen(property.id)}
    >
      {/* DRAG HANDLE */}
      <div
        ref={isAdded ? null : drag}
        onClick={(e) => e.stopPropagation()}
        style={{
          cursor: isAdded ? "not-allowed" : "grab",
          padding: "6px",
          border: "1px dashed #aaa",
          marginBottom: "10px",
          textAlign: "center",
          borderRadius: "5px",
          backgroundColor: isAdded ? "#ddd" : "#f0f0f0",
        }}
      >
        {isAdded ? "Already in Favourites" : "Drag to Favourites"}
      </div>

      {/* BUTTON */}
      <button
        disabled={isAdded}
        onClick={(e) => {
          e.stopPropagation();
          onAddFavourite(property);
        }}
      >
        {isAdded ? "Added" : "Add to Favourites"}
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
  /* FILTER STATES (USED → NO WARNINGS) */
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

  /* DROP ZONE */
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => {
      setFavourites((prev) =>
        prev.some((f) => f.id === item.property.id)
          ? prev
          : [...prev, item.property]
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  /* FILTER FUNCTION */
  const filterProperties = (property) => {
    if (searchType !== "any" && property.type !== searchType) return false;
    if (minBedrooms && property.bedrooms < Number(minBedrooms)) return false;
    if (maxBedrooms && property.bedrooms > Number(maxBedrooms)) return false;
    if (minPrice && property.price < Number(minPrice)) return false;
    if (maxPrice && property.price > Number(maxPrice)) return false;
    if (dateFrom && new Date(property.dateAdded) < new Date(dateFrom)) return false;
    if (dateTo && new Date(property.dateAdded) > new Date(dateTo)) return false;
    if (
      postcodeArea &&
      !property.postcode
        .toUpperCase()
        .startsWith(postcodeArea.toUpperCase())
    )
      return false;

    return true;
  };

  /* PROPERTY PAGE */
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

      {/* SEARCH FORM */}
      <form style={{ marginBottom: "20px" }}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="any">Any</option>
          <option value="house">House</option>
          <option value="flat">Flat</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Bedrooms"
          value={minBedrooms}
          onChange={(e) => setMinBedrooms(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Bedrooms"
          value={maxBedrooms}
          onChange={(e) => setMaxBedrooms(e.target.value)}
        />

        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

        <input
          type="text"
          placeholder="Postcode Area"
          value={postcodeArea}
          onChange={(e) => setPostcodeArea(e.target.value)}
        />
      </form>

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
        <h2>Favourites</h2>
        {favourites.length === 0 && <p>No favourites yet.</p>}
        {favourites.map((fav) => (
          <div key={fav.id} className="property-card">
            <h4>{fav.title}</h4>
            <button
              onClick={() =>
                setFavourites((prev) =>
                  prev.filter((f) => f.id !== fav.id)
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* RESULTS */}
      <div className="results-grid">
        {properties.filter(filterProperties).map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            favourites={favourites}
            onOpen={(id) => setSelectedPropertyId(id)}
            onAddFavourite={(prop) =>
              setFavourites((prev) =>
                prev.some((f) => f.id === prop.id) ? prev : [...prev, prop]
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

export default App;
