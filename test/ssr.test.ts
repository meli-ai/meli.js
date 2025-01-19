import meli from "../src/meli";

test("can load meli in node environment", () => {
  expect(typeof window).toBe("undefined");
  expect(typeof meli.init).toBe("function");
});
