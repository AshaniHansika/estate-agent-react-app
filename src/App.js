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
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "pointer",
      }}
      onClick={() => onOpen(property.id)}
    >
      {/* DRAG HANDLE */}
      <div
        ref={isAdded ? null : drag}
        style={{
          cursor: isAdded ? "not-allowed" : "grab",
          padding: "6px",
          border: "1px dashed #aaa",
          marginBottom: "10px",
          textAlign: "center",
          borderRadius: "5px",
          backgroundColor: isAdded ? "#ddd" : "#f0f0f0",
        }}
        onClick={(e) => e.stopPropagation()}
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
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [favourites, setFavourites] = useState([]);

  /* DROP ZONE – SINGLE ADD GUARANTEED */
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => {
      setFavourites((prev) => {
        if (prev.some((f) => f.id === item.property.id)) return prev;
        return [...prev, item.property];
      });
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

      {/* FAVOURITES */}
      <div
        ref={drop}
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

      {/* SEARCH RESULTS */}
      <div className="results-grid">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            favourites={favourites}
            onOpen={(id) => setSelectedPropertyId(id)}
            onAddFavourite={(prop) =>
              setFavourites((prev) => {
                if (prev.some((f) => f.id === prop.id)) return prev;
                return [...prev, prop];
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

export default App;
