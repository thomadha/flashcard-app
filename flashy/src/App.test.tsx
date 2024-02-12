import React from "react";
import { render, screen } from "@testing-library/react";
import CardViewer from "./CardViewer";

test("renders learn react link", () => {
  render(<CardViewer />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
