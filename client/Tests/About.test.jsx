import { describe, it, expect } from "vitest";// Import necessary testingfunctions from Vitest
import { render,screen } from "@testing-library/react";// Import the renderand screen function from React Testing Library to render React components ina test environment
import About from "../Components/About.jsx";// Import the About componentto be tested
import React from "react"; // Import React to support JSX syntax
import "@testing-library/jest-dom"; //import jest-dom testing library

describe("About", () => {
    it("should render the About component", () => {
    render(<About />); // Render the About component in the virtual DOM provided by the testing library
    //Assertion: check if there is an h1 element
    const aboutElement = screen.getByRole('heading', {level: 1})
    expect(aboutElement).toBeInTheDocument();
    });
    });

    //Test Case 2
it("should have the text about", () => {
    render(<About />);
    const text = screen.queryByText(/about/i);  //i for insenstive values which is in h1 in About.jsx page
    expect(text).toBeInTheDocument();
    }); 
    
    //Test Case 3
it("should have the image", () => {
    render(<About />);
    const image = screen.getByAltText('devimage')  //it will test both image and alt text
    expect(image).toHaveClass('userImage');
    }); 