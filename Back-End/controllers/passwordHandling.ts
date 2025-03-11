import * as bcrypt from "bcrypt";

class PasswordHandling {
  private password: string;
  private pepper: string;
  constructor(password: string) {
    this.password = password;
    this.pepper = process.env.PEPPER || "default";
  }

  public async hashPassword(): Promise<string> {
    const hashedPassword = await bcrypt.hash(this.password, 16);
    return hashedPassword;
  }
  /**
   *
   * @param hashedPassword - hashed password
   * @returns
   */
  public async comparePassword(hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(this.password, hashedPassword);
    return isMatch;
  }
}
export default PasswordHandling;
