import UserValidation from "../controllers/login/user_validation";

let userValidation: UserValidation;

beforeEach(() => {
  userValidation = new UserValidation();
});

describe("User Validation", () => {
  it("Error User test 1", () => {
    expect(userValidation.checkEmail("badmail")).toBe(false);
  });

  it("Error User test 2", () => {
    expect(userValidation.checkEmail("badmail@asdsad")).toBe(false);
  });

  it("Error User test 3", () => {
    expect(userValidation.checkEmail("badmail@asdsad.")).toBe(false);
  });

  it("Error User test 4", () => {
    expect(userValidation.checkEmail("badmail@.pl")).toBe(false);
  });

  it("Correct User", () => {
    expect(userValidation.checkEmail("badmail@test.pl")).toBe(true);
  });
});

describe("Password Validation", () => {
  it("Password is to short", () => {
    expect(userValidation.checkPassword("ToSho1%")).toBe(false);
  });

  it("Password dont have uppercase char", () => {
    expect(userValidation.checkPassword("password12$")).toBe(false);
  });

  it("Password dont have special char", () => {
    expect(userValidation.checkPassword("Password1234")).toBe(false);
  });

  it("Password dont have nuumber", () => {
    expect(userValidation.checkPassword("Password!@#")).toBe(false);
  });

  it("Password uppercase", () => {
    expect(userValidation.checkPassword("Password123!")).toBe(true);
  });
});
