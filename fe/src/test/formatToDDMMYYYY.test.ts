import formatToDDMMYYYY from "../utils/formatToDDMMYYYY";

describe("formatToDDMMYYYY", () => {
    it("should format a date object to DD/MM/YYYY", () => {
        const inputDate = new Date("2022-01-15T12:30:00.000Z");
        expect(formatToDDMMYYYY(inputDate)).toBe("15/1/2022");
    });

    it("should format a string date to DD/MM/YYYY", () => {
        const inputDate = "2022-01-15T12:30:00.000Z";
        expect(formatToDDMMYYYY(inputDate)).toBe("15/1/2022");
    });

    it("should format a date object with double-digit day and month to DD/MM/YYYY", () => {
        const inputDate = new Date("2022-11-25T12:30:00.000Z");
        expect(formatToDDMMYYYY(inputDate)).toBe("25/11/2022");
    });

    it("should format a string date with double-digit day and month to DD/MM/YYYY", () => {
        const inputDate = "2022-11-25T12:30:00.000Z";
        expect(formatToDDMMYYYY(inputDate)).toBe("25/11/2022");
    });

    it("should handle a string date with a different format", () => {
        const inputDate = "2022-12-25";
        expect(formatToDDMMYYYY(inputDate)).toBe("Invalid Date");
    });

    it("should handle an invalid date object", () => {
        const inputDate = new Date("invalid");
        expect(formatToDDMMYYYY(inputDate)).toBe("Invalid Date");
    });


    it("should handle an empty string", () => {
        const inputDate = "";
        expect(formatToDDMMYYYY(inputDate)).toBe("Invalid Date");
    });

    it("should handle a date object with time information", () => {
        const inputDate = new Date("2022-01-15T12:30:00.000Z");
        expect(formatToDDMMYYYY(inputDate)).toBe("15/1/2022");
    });

    // Add more test cases...

    it("should format a date object with a different time zone", () => {
        const inputDate = new Date("2022-01-15T12:30:00.000-05:00");
        expect(formatToDDMMYYYY(inputDate)).toBe("15/1/2022");
    });

    it("should handle a string date with a different time zone", () => {
        const inputDate = "2022-01-15T12:30:00.000-05:00";
        expect(formatToDDMMYYYY(inputDate)).toBe("15/1/2022");
    });

    it("should handle a date object with zero-padded month and day", () => {
        const inputDate = new Date("2022-01-05T12:30:00.000Z");
        expect(formatToDDMMYYYY(inputDate)).toBe("5/1/2022");
    });

    it("should handle a string date with zero-padded month and day", () => {
        const inputDate = "2022-01-05T12:30:00.000Z";
        expect(formatToDDMMYYYY(inputDate)).toBe("5/1/2022");
    });

    it("should handle a date object with zero-padded month and double-digit day", () => {
        const inputDate = new Date("2022-01-25T12:30:00.000Z");
        expect(formatToDDMMYYYY(inputDate)).toBe("25/1/2022");
    });

    it("should handle a string date with zero-padded month and double-digit day", () => {
        const inputDate = "2022-01-25T12:30:00.000Z";
        expect(formatToDDMMYYYY(inputDate)).toBe("25/1/2022");
    });

    it("should handle a date object with double-digit month and zero-padded day", () => {
        const inputDate = new Date("2022-11-05T12:30:00.000Z");
        expect(formatToDDMMYYYY(inputDate)).toBe("5/11/2022");
    });

    it("should handle a string date with double-digit month and zero-padded day", () => {
        const inputDate = "2022-11-05T12:30:00.000Z";
        expect(formatToDDMMYYYY(inputDate)).toBe("5/11/2022");
    });
});
