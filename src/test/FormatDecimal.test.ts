import FormatDecimal from "../utils/FormatDecimal";

describe("FormatDecimal", () => {
    it("should format positive integer as decimal", () => {
        expect(FormatDecimal(12345)).toBe("12,345");
    });

    it("should format negative integer as decimal", () => {
        expect(FormatDecimal(-6789)).toBe("-6,789");
    });

    it("should format zero as decimal", () => {
        expect(FormatDecimal(0)).toBe("0");
    });

    it("should format positive float as decimal", () => {
        expect(FormatDecimal(12345.6789)).toBe("12,345.679");
    });

    it("should format negative float as decimal", () => {
        expect(FormatDecimal(-9876.54321)).toBe("-9,876.543");
    });

    it("should format stringified positive integer as decimal", () => {
        expect(FormatDecimal("54321")).toBe("54,321");
    });

    it("should format stringified negative integer as decimal", () => {
        expect(FormatDecimal("-98765")).toBe("-98,765");
    });

    it("should format stringified zero as decimal", () => {
        expect(FormatDecimal("0")).toBe("0");
    });

    it("should format stringified positive float as decimal", () => {
        expect(FormatDecimal("12345.6789")).toBe("12,345.679");
    });

    it("should format stringified negative float as decimal", () => {
        expect(FormatDecimal("-9876.54321")).toBe("-9,876.543");
    });

    it("should handle empty string as decimal", () => {
        expect(FormatDecimal("")).toBe("NaN");
    });

    it("should handle non-numeric string as decimal", () => {
        expect(FormatDecimal("abc")).toBe("NaN");
    });

    it("should format large positive integer as decimal", () => {
        expect(FormatDecimal(1234567890)).toBe("1,234,567,890");
    });

    it("should format large negative integer as decimal", () => {
        expect(FormatDecimal(-9876543210)).toBe("-9,876,543,210");
    });

    it("should format large positive float as decimal", () => {
        expect(FormatDecimal(1234567890.987654321)).toBe("1,234,567,890.988");
    });

    it("should format large negative float as decimal", () => {
        expect(FormatDecimal(-9876543210.123456789)).toBe("-9,876,543,210.123");
    });
});
