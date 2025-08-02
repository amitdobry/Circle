/**
 * Simple User Flow Test
 */

import { render, screen } from "@testing-library/react";
import React from "react";

// Minimal test component
const TestButton = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

describe("Simple Test", () => {
  test("should render a button", () => {
    render(<TestButton>Click me</TestButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
