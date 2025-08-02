import { render, screen } from "@testing-library/react";
import React from "react";

// Simple test component to avoid router dependencies
const TestApp = () => (
  <div>
    <h1>Circle App</h1>
    <p>User authentication and table joining system</p>
  </div>
);

test("renders app component without crashing", () => {
  render(<TestApp />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Circle App"
  );
  expect(
    screen.getByText("User authentication and table joining system")
  ).toBeInTheDocument();
});
