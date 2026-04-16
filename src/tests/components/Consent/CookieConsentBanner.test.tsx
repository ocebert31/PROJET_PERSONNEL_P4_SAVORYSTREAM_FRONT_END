import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import CookieConsentBanner from "../../../components/Consent/CookieConsentBanner";
import { ConsentProvider } from "../../../context/ConsentContext";
import { CONSENT_STORAGE_KEY } from "../../../common/Consent/consentStorage";

function renderBanner() {
  return render(
    <MemoryRouter>
      <ConsentProvider>
        <CookieConsentBanner />
      </ConsentProvider>
    </MemoryRouter>,
  );
}

function renderBannerWithCookiesRoute() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ConsentProvider>
        <Routes>
          <Route path="/" element={<CookieConsentBanner />} />
          <Route path="/cookies" element={<h1>Cookies page</h1>} />
        </Routes>
      </ConsentProvider>
    </MemoryRouter>,
  );
}

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("nominal case", () => {
    it("renders consent banner with accept/reject actions", () => {
      renderBanner();
      expect(screen.getByRole("dialog", { name: "Préférences cookies" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Tout accepter" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Tout refuser" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "politique cookies" })).toHaveAttribute("href", "/cookies");
    });
  });

  describe("variations", () => {
    it("navigates to cookies policy page when cookies link is clicked", async () => {
      const user = userEvent.setup();
      renderBannerWithCookiesRoute();

      await user.click(screen.getByRole("link", { name: "politique cookies" }));

      expect(screen.getByRole("heading", { level: 1, name: "Cookies page" })).toBeInTheDocument();
    });

    it("stores accepted status and hides banner", async () => {
      const user = userEvent.setup();
      renderBanner();
      await user.click(screen.getByRole("button", { name: "Tout accepter" }));
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("accepted");
      expect(screen.queryByRole("dialog", { name: "Préférences cookies" })).not.toBeInTheDocument();
    });

    it("stores rejected status and hides banner", async () => {
      const user = userEvent.setup();
      renderBanner();
      await user.click(screen.getByRole("button", { name: "Tout refuser" }));
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("rejected");
      expect(screen.queryByRole("dialog", { name: "Préférences cookies" })).not.toBeInTheDocument();
    });

    it("does not render when consent already exists", () => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
      renderBanner();
      expect(screen.queryByRole("dialog", { name: "Préférences cookies" })).not.toBeInTheDocument();
    });
  });
});
