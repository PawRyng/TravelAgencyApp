class UserValidation {
  private password: string;
  constructor() {
    this.password = "";
  }
  public checkEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
  }

  private checkPasswordLength(): boolean {
    return this.password.length > 8;
  }
  private checkPasswordHasUppercase(): boolean {
    const regex = /[A-Z]/;
    return regex.test(this.password);
  }
  private checkPasswordHasSpecialChar(): boolean {
    const regex = /[!@#$%^&*(),.?":{}|<>]/;

    return regex.test(this.password);
  }
  private checkPasswordHasNumber(): boolean {
    const regex = /\d/;
    return regex.test(this.password);
  }

  public checkPassword(password: string): boolean {
    this.password = password;

    if (
      this.checkPasswordLength() &&
      this.checkPasswordHasUppercase() &&
      this.checkPasswordHasSpecialChar() &&
      this.checkPasswordHasNumber()
    ) {
      return true;
    }
    return false;
  }
}

export default UserValidation;
