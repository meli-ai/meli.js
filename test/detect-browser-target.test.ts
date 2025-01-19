import { detectBrowserTarget } from "../src/detect-browser-target";

// Helper function to check browser target for different user agents
const testBrowserTarget = (userAgent: string, expectedTarget: string): void => {
  expect(detectBrowserTarget(userAgent)).toBe(expectedTarget);
};

test("chrome legacy", () => {
  const legacyChrome = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0.1; RedMi Note 5 Build/RB3N5C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36",
  ];
  legacyChrome.forEach((ua) => testBrowserTarget(ua, "legacy"));
});

test("chrome es2020", () => {
  const es2020Chrome = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
  ];
  es2020Chrome.forEach((ua) => testBrowserTarget(ua, "es2020"));
});

test("safari legacy", () => {
  const legacySafari = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15",
  ];
  legacySafari.forEach((ua) => testBrowserTarget(ua, "legacy"));
});

test("safari es2020", () => {
  const es2020Safari = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  ];
  es2020Safari.forEach((ua) => testBrowserTarget(ua, "es2020"));
});

test("firefox legacy", () => {
  const legacyFirefox = [
    "Mozilla/5.0 (Windows NT 5.1; rv:7.0.1) Gecko/20100101 Firefox/7.0.1",
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0",
  ];
  legacyFirefox.forEach((ua) => testBrowserTarget(ua, "legacy"));
});

test("firefox es2020", () => {
  const es2020Firefox = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/74.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
  ];
  es2020Firefox.forEach((ua) => testBrowserTarget(ua, "es2020"));
});

test("edge legacy", () => {
  const legacyEdge = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 Edg/79.0.622.51",
  ];
  legacyEdge.forEach((ua) => testBrowserTarget(ua, "legacy"));
});

test("edge es2020", () => {
  const es2020Edge = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 Edg/80.0.622.51",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 Edg/86.0.622.51",
  ];
  es2020Edge.forEach((ua) => testBrowserTarget(ua, "es2020"));
});

test("opera legacy", () => {
  const legacyOpera = [
    "Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.72",
  ];
  legacyOpera.forEach((ua) => testBrowserTarget(ua, "legacy"));
});

test("opera es2020", () => {
  const es2020Opera = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97",
  ];
  es2020Opera.forEach((ua) => testBrowserTarget(ua, "es2020"));
});
