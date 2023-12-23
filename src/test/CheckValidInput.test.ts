import CheckValidInput from "../utils/CheckValidInput";

describe("CheckValidInput", () => {
    it("should return an error message for blank input", () => {
        const errorMessage = CheckValidInput({ email: "" });
        expect(errorMessage).toBe("Không được để trống");
    });

    it("should return an error message for invalid email", () => {
        const errorMessage = CheckValidInput({ email: "invalidEmail" });
        expect(errorMessage).toBe("Email không hợp lệ");
    });

    it("should return an error message for invalid password", () => {
        const errorMessage = CheckValidInput({ password: "weakpassword" });
        expect(errorMessage).toBe("Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt");
    });

    it("should return an error message for weak password", () => {
        const errorMessage = CheckValidInput({ password: "12345" });
        expect(errorMessage).toBe("Mật khẩu phải có ít nhất 6 ký tự");
    });

    it("should return an error message for invalid repassword", () => {
        const errorMessage = CheckValidInput({
            password: "StrongP@ssword1",
            repassword: "MismatchedPassword",
        });
        expect(errorMessage).toBe("Mật khẩu không khớp");
    });

    it("should return an error message for invalid OTP", () => {
        const errorMessage = CheckValidInput({ otp: "12345" });
        expect(errorMessage).toBe("Mã OTP không hợp lệ");
    });

    it("should return an error message for non-numeric input", () => {
        const errorMessage = CheckValidInput({ number: "abc" });
        expect(errorMessage).toBe("Chỉ được nhập số 0-9");
    });

    it("should return an error message for invalid phone number format", () => {
        const errorMessage = CheckValidInput({ phone: "123" });
        expect(errorMessage).toBe("Số điện thoại không hợp lệ");
    });

    it("should return an error message for invalid phone number length", () => {
        const errorMessage = CheckValidInput({ phone: "01234567890" });
        expect(errorMessage).toBe("Số điện thoại không hợp lệ");
    });

    it("should not return an error message for valid input", () => {
        const errorMessage = CheckValidInput({
            email: "valid@email.com",
            password: "StrongP@ssword1",
            repassword: "StrongP@ssword1",
            otp: "123456",
            number: "12345",
            phone: "0123456789",
        });
        expect(errorMessage).toBe("");
    });

    it("should not return an error message for valid phone number with leading zeros", () => {
        const errorMessage = CheckValidInput({ phone: "0123456789" });
        expect(errorMessage).toBe("");
    });
});
