import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./index";
import { MemoryRouter, Route } from "react-router-dom";
import Page from "./components/FlashCardEditor";
import { fireEvent } from "@testing-library/dom";
import 'text-encoding';


/*test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/


// TEST FOR Å LAGRING OG ORGANISERING (opprette, slette og endre sett/kort, samt rendere side og komponenter)

/*describe('Side-komponenter', () => {

  test('Render korrekt', async () => {
    render(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Route path="/" Component={Page} />
      </MemoryRouter>
    );

    // Sjekker om komponentene render
    expect(screen.getByText('Framside')).toBeInTheDocument();
    expect(screen.getByText('Bakside')).toBeInTheDocument();
    expect(screen.getByText('Legg til et FlashCard Set blant settene til')).toBeInTheDocument();
    expect(screen.getByText('Lagre')).toBeInTheDocument();
    expect(screen.getByText('Slett')).toBeInTheDocument();
    expect(screen.getByLabelText('Vis settet til andre brukere')).toBeInTheDocument();

    // Sjekker om knappene for hvert kort render
    expect(screen.getByText('Framside 1')).toBeInTheDocument();
    expect(screen.getByText('Framside 2')).toBeInTheDocument();
    expect(screen.getByText('Nytt flashcard')).toBeInTheDocument();

    // Sjekker om hver initiering av kort har et tomt tekstfelt
    expect(screen.getByPlaceholderText('Her kan du skrive noe: ')).toHaveValue('');
  });
*/


test('Tekstendring i FlashCardEditor', async () => {
  render(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <Route path="/" Component={Page} />
    </MemoryRouter>
  );

  // Endrer forside tekst i FlashCardEditor og sjekker om den oppdateres
  const frontTextArea = screen.getByPlaceholderText('Her kan du skrive noe: ');
  fireEvent.change(frontTextArea, { target: { value: 'Ny framside tekst' } });
  expect(frontTextArea).toHaveValue('Ny framside tekst');

  // Endrer bakside tekst i FlashCardEditor og sjekker om den oppdateres
  const backTextArea = screen.getAllByPlaceholderText('Her kan du skrive noe: ')[1];
  fireEvent.change(backTextArea, { target: { value: 'Ny bakside tekst' } });
  expect(backTextArea).toHaveValue('Ny bakside tekst');
});


//});