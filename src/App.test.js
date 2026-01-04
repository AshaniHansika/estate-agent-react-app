
// Mock react-dnd so useDrag/useDrop don’t break Jest
jest.mock("react-dnd", () => ({
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{ isOver: false }, jest.fn()],
}));
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import properties from "./properties.json";

// ---------------- Test 1: App renders ----------------
test("renders Estate Agent App header", () => {
  render(<App />);
  expect(screen.getByText(/Estate Agent App/i)).toBeInTheDocument();
});

// ---------------- Test 2: Property list renders all properties ----------------
test("renders all properties initially", () => {
  render(<App />);
  const propertyCards = screen.getAllByRole("heading", { level: 3 });
  expect(propertyCards.length).toBe(properties.length);
});

// ---------------- Test 3: Add property to favourites via button ----------------
test("can add a property to favourites", () => {
  render(<App />);
  const addButtons = screen.getAllByText("Add to Favourites");
  fireEvent.click(addButtons[0]);
  // Check that the text changes to indicate already added
  expect(screen.getByText("Already in Favourites")).toBeInTheDocument();
});

// ---------------- Test 4: PropertyPage displays correct details ----------------
test("opens PropertyPage with correct details", () => {
  render(<App />);
  const propertyCards = screen.getAllByRole("heading", { level: 3 });
  fireEvent.click(propertyCards[0]);
  expect(screen.getByText(properties[0].shortDescription)).toBeInTheDocument();
  expect(screen.getByText(/Type:/i)).toBeInTheDocument();
  expect(screen.getByText(/Price:/i)).toBeInTheDocument();
  expect(screen.getByText(/Bedrooms:/i)).toBeInTheDocument();
});

// ---------------- Test 5: Empty favourites fallback message ----------------
test("shows 'No favourites yet' when empty", () => {
  render(<App />);
  expect(screen.getByText(/No favourites yet/i)).toBeInTheDocument();
});
