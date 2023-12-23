import ConvertDate from "../utils/ConvertDate";

describe("ConvertDate", () => {
    it("should return the correct date and time for a specific input", () => {
        const date = ConvertDate("2021-03-10T10:00:00.000Z");
        expect(date).toBe("17:00:00, 10/03/21");
    });

    it("should handle a different input date and time", () => {
        const date = ConvertDate("2022-01-15T08:30:00.000Z");
        expect(date).toBe("15:30:00, 15/01/22");
    });

    it("should handle midnight time", () => {
        const date = ConvertDate("2023-06-05T00:00:00.000Z");
        expect(date).toBe("07:00:00, 05/06/23");
    });

    it("should handle a date in a different time zone", () => {
        const date = ConvertDate("2022-09-20T15:45:00.000Z");
        expect(date).toBe("22:45:00, 20/09/22");
    });

    it("should handle a date with milliseconds", () => {
        const date = ConvertDate("2022-12-01T18:20:30.123Z");
        expect(date).toBe("01:20:30, 02/12/22");
    });

    it("should handle a date with seconds as zero", () => {
        const date = ConvertDate("2023-04-18T09:15:00.000Z");
        expect(date).toBe("16:15:00, 18/04/23");
    });

    it("should handle a date with a different format", () => {
        const date = ConvertDate("2022-07-08T14:45:00.000Z");
        expect(date).toBe("21:45:00, 08/07/22");
    });

    it("should handle a date with a different time zone (2)", () => {
        const date = ConvertDate("2021-11-30T12:30:00.000Z");
        expect(date).toBe("19:30:00, 30/11/21");
    });

    it("should handle a date with a different time zone (3)", () => {
        const date = ConvertDate("2022-05-25T23:59:59.999Z");
        expect(date).toBe("06:59:59, 26/05/22");
    });
});
