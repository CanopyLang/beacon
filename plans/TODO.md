# canopy/beacon — TODO

## Status: Production Ready (v1.0.0)

Beacon API for fire-and-forget data transmission during page unload. Excellent test coverage.

---

## Features to Add

- [ ] Beacon retry — queue failed beacons for retry on next page load
- [ ] Beacon batching — combine multiple payloads into single request
- [ ] Analytics integration patterns — common event tracking helper
- [ ] Payload size validation (browsers limit to ~64KB)
- [ ] `sendOnUnload` — Convenience for registering unload handler + beacon

---

## Test Improvements

- [ ] Excellent coverage (2 test files, 80+ tests) — maintain for new additions
