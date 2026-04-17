import { describe, it, expect, beforeEach } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  canRunOptionalTracking,
  getConsentStatus,
  setConsentStatus,
} from "../../../common/consent/consentStorage";

describe("consentStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("setConsentStatus", () => {
    describe("nominal case", () => {
      it("stores accepted status in localStorage", () => {
        setConsentStatus("accepted");
        expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("accepted");
      });
    });

    describe("variations", () => {
      it("stores rejected status in localStorage", () => {
        setConsentStatus("rejected");
        expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("rejected");
      });
    });
  });

  describe("getConsentStatus", () => {
    describe("nominal case", () => {
      it("returns accepted when accepted status is stored", () => {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
        expect(getConsentStatus()).toBe("accepted");
      });
    });

    describe("variations", () => {
      it("returns rejected when rejected status is stored", () => {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, "rejected");
        expect(getConsentStatus()).toBe("rejected");
      });

      it("returns null when consent is missing", () => {
        expect(getConsentStatus()).toBeNull();
      });

      it("returns null when stored value is invalid", () => {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, "invalid");
        expect(getConsentStatus()).toBeNull();
      });
    });
  });

  describe("canRunOptionalTracking", () => {
    describe("nominal case", () => {
      it("returns true when consent is accepted", () => {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
        expect(canRunOptionalTracking()).toBe(true);
      });
    });

    describe("variations", () => {
      it("returns false when consent is rejected", () => {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, "rejected");
        expect(canRunOptionalTracking()).toBe(false);
      });

      it("returns false when consent is missing", () => {
        expect(canRunOptionalTracking()).toBe(false);
      });

      it("returns false when stored value is invalid", () => {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, "invalid");
        expect(canRunOptionalTracking()).toBe(false);
      });
    });
  });
});
