import properties from "./properties.json";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Estate Agent App</h1>

      {properties.map((property) => (
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
