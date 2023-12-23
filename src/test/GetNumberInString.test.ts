import GetNumberInString from "../utils/GetNumberInString";

describe("GetNumberInString", () => {
    it("should extract a single digit from the string", () => {
        expect(GetNumberInString("Hello 5 World")).toBe("5");
    });

    it("should extract multiple digits from the string", () => {
        expect(GetNumberInString("There are 123 numbers in this string")).toBe("123");
    });

    it("should handle no digits in the string", () => {
        expect(GetNumberInString("No numbers here!")).toBe(null);
    });

    it("should handle leading and trailing non-digit characters", () => {
        expect(GetNumberInString("@#$%^&*12345@#$%^&*")).toBe("12345");
    });

    it("should handle mixed alphanumeric characters", () => {
        expect(GetNumberInString("abc123def")).toBe("123");
    });

    it("should handle spaces between digits", () => {
        expect(GetNumberInString("1 2 3")).toBe("123");
    });

    it("should handle negative numbers", () => {
        expect(GetNumberInString("The temperature is -10 degrees Celsius")).toBe("-10");
    });

    it("should handle decimals", () => {
        expect(GetNumberInString("The price is $12.34")).toBe("1234");
    });

    it("should handle leading zeros", () => {
        expect(GetNumberInString("00123")).toBe("00123");
    });

    it("should handle scientific notation", () => {
        expect(GetNumberInString("The speed of light is approximately 3.00e8 meters per second")).toBe("300");
    });

    it("should handle commas in large numbers", () => {
        expect(GetNumberInString("The population is 1,234,567")).toBe("1234567");
    });

    // Add more test cases...

    it("should handle an empty string", () => {
        expect(GetNumberInString("")).toBe(null);
    });

    it("should handle a string with only non-digit characters", () => {
        expect(GetNumberInString("!@#$%^&*()")).toBe(null);
    });

    it("should handle a string with only whitespaces", () => {
        expect(GetNumberInString("   ")).toBe(null);
    });

    it("should handle special characters in the middle of the number", () => {
        expect(GetNumberInString("12@34")).toBe("1234");
    });

    it("should handle a string with only a minus sign", () => {
        expect(GetNumberInString("-")).toBe(null);
    });

    it("should handle a string with only a plus sign", () => {
        expect(GetNumberInString("+")).toBe(null);
    });

    it("should handle a string with both a minus and plus sign", () => {
        expect(GetNumberInString("-+")).toBe(null);
    });

    it("should handle a string with a mix of special characters", () => {
        expect(GetNumberInString("!@#123$%^&*()")).toBe("123");
    });
});
