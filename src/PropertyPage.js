import { useState } from "react";
import properties from "./properties.json";
import "./App.css";

function PropertyPage({ propertyId, onBack }) {
  const property = properties.find((p) => p.id === propertyId);
  const [mainImage, setMainImage] = useState(property.images[0]);

  if (!property) return <div>Property not found</div>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBack}>Back to Search</button>
      <h1>{property.title}</h1>
      <p>Type: {property.type}</p>
      <p>Price: £{property.price}</p>
      <p>Bedrooms: {property.bedrooms}</p>
      <p>Postcode: {property.postcode}</p>
      <p>Date Added: {property.dateAdded}</p>

      {/* Main Image */}
      <img
        src={mainImage}
        alt={property.title}
        style={{ width: "400px", height: "300px", objectFit: "cover" }}
      />

      {/* Thumbnails */}
      <div style={{ display: "flex", marginTop: "10px" }}>
        {property.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${property.title} ${index}`}
            style={{
              width: "100px",
              height: "75px",
              objectFit: "cover",
              marginRight: "10px",
              cursor: "pointer",
            }}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>

      {/* Tabs (Long Description / Floor Plan / Map) */}
      <div style={{ marginTop: "20px" }}>
        <button>Details</button>
        <button>Floor Plan</button>
        <button>Map</button>

        {/* For now, show description */}
        <div>
          <p>{property.shortDescription}</p>
        </div>
      </div>
    </div>
  );
}

export default PropertyPage;
