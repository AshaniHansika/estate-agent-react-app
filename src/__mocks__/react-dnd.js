/**
 * This file mocks react-dnd hooks so that Jest tests
 * do not break when drag-and-drop logic is present.
 *
 * Jest runs in a simulated DOM environment and does not
 * support HTML5 drag-and-drop natively.
 *
 * By mocking useDrag and useDrop, we can safely test
 * components without triggering drag behaviour.
 */

export const useDrag = jest.fn(() => [
  { isDragging: false }, // Simulated drag state
  jest.fn(),             // Mock drag ref function
]);

export const useDrop = jest.fn(() => [
  { isOver: false },     // Simulated drop hover state
  jest.fn(),             // Mock drop ref function
]);
