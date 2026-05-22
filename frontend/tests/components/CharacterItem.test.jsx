import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CharacterItem from "@/components/CharacterItem";

describe("<CharacterItem />", () => {
  it("renders a circular image avatar when imageUrl is provided", () => {
    render(
      <CharacterItem
        character={{
          name: "Goblin",
          type: "monster",
          imageUrl: "https://example.test/goblin.png",
        }}
        isActive={false}
        onClick={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: /goblin/i });
    const image = button.querySelector("img.character-item-image");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.test/goblin.png");
  });
});
