import { useState } from "react";
import properties from "./properties.json";
import "./App.css";

function PropertyPage({ propertyId, onBack }) {
  const property = properties.find((p) => p.id === propertyId);
  const [mainImage, setMainImage] = useState(property?.images[0] || "");
  const [activeTab, setActiveTab] = useState("details"); // tabs: details, floorplan, map

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
      {mainImage && (
        <img
          src={mainImage}
          alt={property.title}
          style={{
            width: "600px",
            maxWidth: "100%",
            height: "400px",
            objectFit: "cover",
            marginTop: "10px",
            borderRadius: "8px",
          }}
        />
      )}

      {/* Thumbnails */}
      {property.images && property.images.length > 0 && (
        <div className="thumbnails">
          {property.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${property.title} ${index + 1}`}
              className={mainImage === img ? "selected" : ""}
              onClick={() => setMainImage(img)}
              style={{
                cursor: "pointer",
                width: "100px",
                height: "75px",
                objectFit: "cover",
                marginRight: "10px",
                marginTop: "10px",
                border: mainImage === img ? "2px solid #007bff" : "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs" style={{ marginTop: "20px" }}>
        {["details", "floorplan", "map"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active" : ""}
            style={{
              marginRight: "10px",
              padding: "6px 12px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              backgroundColor: activeTab === tab ? "#007bff" : "#ccc",
              color: activeTab === tab ? "#fff" : "#000",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="tab-content"
        style={{
          marginTop: "15px",
          border: "1px solid #ccc",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        {activeTab === "details" && <p>{property.shortDescription}</p>}

        {activeTab === "floorplan" && property.floorPlan && (
          <img
            src={property.floorPlan}
            alt={`${property.title} Floor Plan`}
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              borderRadius: "8px",
              marginTop: "10px",
              objectFit: "contain",
            }}
          />
        )}

        {activeTab === "map" && (
          <iframe
            title="Google Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              property.postcode + " " + property.title
            )}&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        )}
      </div>
    </div>
  );
}

export default PropertyPage;
