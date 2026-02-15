import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Fans from "./Fans.jsx";

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../lib/api.js", () => ({
  default: mockApi,
}));

describe("Fans merch order flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("dj_silver_guest_name", "Test Fan");

    mockApi.get.mockResolvedValue({
      data: {
        posts: [],
        comments: [],
      },
    });

    mockApi.post.mockImplementation((url) => {
      if (url === "/api/merch/checkout-session") {
        return Promise.resolve({ data: { url: "https://checkout.stripe.com/session/test_123" } });
      }
      return Promise.resolve({ data: {} });
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("starts Stripe checkout from merch Order button", async () => {
    const user = userEvent.setup();
    render(<Fans />);

    await screen.findByText(/Official fan gear available to order now/i);

    const orderButtons = screen.getAllByRole("button", { name: /^order$/i });
    await user.click(orderButtons[0]);

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith(
        "/api/merch/checkout-session",
        expect.objectContaining({
          itemId: "silver-tee",
          quantity: 1,
        })
      );
    });

    expect(mockApi.post).toHaveBeenCalled();
  });
});
