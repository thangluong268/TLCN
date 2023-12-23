import FormatMoney from "../utils/FormatMoney";

describe("FormatMoney", () => {
    it("should format positive integer as VND currency", () => {
        expect(FormatMoney(12345)).toBe("12,345 ₫");
    });

    it("should format negative integer as VND currency", () => {
        expect(FormatMoney(-6789)).toBe("-6,789 ₫");
    });

    it("should format zero as VND currency", () => {
        expect(FormatMoney(0)).toBe("0 ₫");
    });

    it("should format positive float as VND currency", () => {
        expect(FormatMoney(12345.6789)).toBe("12,345.679 ₫");
    });

    it("should format negative float as VND currency", () => {
        expect(FormatMoney(-9876.54321)).toBe("-9,876.543 ₫");
    });

    it("should handle large positive integer as VND currency", () => {
        expect(FormatMoney(1234567890)).toBe("1,234,567,890 ₫");
    });

    it("should handle large negative integer as VND currency", () => {
        expect(FormatMoney(-9876543210)).toBe("-9,876,543,210 ₫");
    });

    it("should handle large positive float as VND currency", () => {
        expect(FormatMoney(1234567890.987654321)).toBe("1,234,567,890.988 ₫");
    });

    it("should handle large negative float as VND currency", () => {
        expect(FormatMoney(-9876543210.123456789)).toBe("-9,876,543,210.123 ₫");
    });
});
