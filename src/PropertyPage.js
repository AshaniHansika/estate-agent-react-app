import { useState } from "react";
import properties from "./properties.json";
import "./App.css";

function PropertyPage({ propertyId, onBack }) {
  const property = properties.find((p) => p.id === propertyId);
  const [mainImage, setMainImage] = useState(property.images[0]);
  const [activeTab, setActiveTab] = useState("details"); // "details", "floorplan", "map"

  if (!property) return <div>Property not found</div>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBack} style={{ marginBottom: "20px" }}>
        ← Back to Search
      </button>

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
        style={{ width: "600px", height: "400px", objectFit: "cover", marginTop: "10px" }}
      />

      {/* Thumbnails */}
      <div style={{ display: "flex", marginTop: "10px", flexWrap: "wrap" }}>
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
              marginBottom: "10px",
              cursor: "pointer",
              border: mainImage === img ? "2px solid #007bff" : "1px solid #ccc",
            }}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>

      {/* Tabs */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setActiveTab("details")}
          style={{
            marginRight: "10px",
            backgroundColor: activeTab === "details" ? "#007bff" : "#ccc",
            color: activeTab === "details" ? "#fff" : "#000",
          }}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("floorplan")}
          style={{
            marginRight: "10px",
            backgroundColor: activeTab === "floorplan" ? "#007bff" : "#ccc",
            color: activeTab === "floorplan" ? "#fff" : "#000",
          }}
        >
          Floor Plan
        </button>
        <button
          onClick={() => setActiveTab("map")}
          style={{
            backgroundColor: activeTab === "map" ? "#007bff" : "#ccc",
            color: activeTab === "map" ? "#fff" : "#000",
          }}
        >
          Map
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: "15px", border: "1px solid #ccc", padding: "10px" }}>
        {activeTab === "details" && <p>{property.shortDescription}</p>}
        {activeTab === "floorplan" && <p>Floor Plan will be shown here (replace with image or diagram).</p>}
        {activeTab === "map" && (
          <iframe
            title="Google Map"
            src={`https://www.google.com/maps?q=${property.postcode}&output=embed`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        )}
      </div>
    </div>
  );
}

export default PropertyPage;
