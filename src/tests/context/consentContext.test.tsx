import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { ConsentProvider, useConsent } from "../../context/consentContext";
import { CONSENT_STORAGE_KEY } from "../../common/consent/consentStorage";

function ConsentConsumer() {
  const { status, accept, reject } = useConsent();

  return (
    <div>
      <p data-testid="status">{status ?? "none"}</p>
      <button type="button" onClick={accept}>
        accept
      </button>
      <button type="button" onClick={reject}>
        reject
      </button>
    </div>
  );
}

describe("ConsentContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("nominal case", () => {
    it("initializes provider status from storage and exposes actions", async () => {
      const user = userEvent.setup();
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");

      render(
        <ConsentProvider>
          <ConsentConsumer />
        </ConsentProvider>,
      );

      expect(screen.getByTestId("status")).toHaveTextContent("accepted");

      await user.click(screen.getByRole("button", { name: "reject" }));
      expect(screen.getByTestId("status")).toHaveTextContent("rejected");
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("rejected");
    });
  });

  describe("variations", () => {
    it("starts with null status when stored value is invalid", () => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "invalid");

      render(
        <ConsentProvider>
          <ConsentConsumer />
        </ConsentProvider>,
      );

      expect(screen.getByTestId("status")).toHaveTextContent("none");
    });

    it("starts with null status when nothing is stored and accepts consent", async () => {
      const user = userEvent.setup();

      render(
        <ConsentProvider>
          <ConsentConsumer />
        </ConsentProvider>,
      );

      expect(screen.getByTestId("status")).toHaveTextContent("none");

      await user.click(screen.getByRole("button", { name: "accept" }));
      expect(screen.getByTestId("status")).toHaveTextContent("accepted");
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("accepted");
    });

    it("updates status from rejected to accepted", async () => {
      const user = userEvent.setup();
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "rejected");

      render(
        <ConsentProvider>
          <ConsentConsumer />
        </ConsentProvider>,
      );

      expect(screen.getByTestId("status")).toHaveTextContent("rejected");

      await user.click(screen.getByRole("button", { name: "accept" }));
      expect(screen.getByTestId("status")).toHaveTextContent("accepted");
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("accepted");
    });

    it("throws when useConsent is called outside ConsentProvider", () => {
      expect(() => render(<ConsentConsumer />)).toThrow("useConsent must be used within ConsentProvider");
    });
  });
});
