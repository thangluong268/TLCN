import DifferenceTime from "../utils/DifferenceTime";

describe("DifferenceTime", () => {
    it("should return 'Vừa xong' for the current time", () => {
        const currentTime = new Date();
        expect(DifferenceTime(currentTime)).toBe("Vừa xong");
    });

    it("should return '1 phút trước' for a time 1 minute ago", () => {
        const oneMinuteAgo = new Date(new Date().getTime() - 1000 * 60);
        expect(DifferenceTime(oneMinuteAgo)).toBe("1 phút trước");
    });

    it("should return '2 giờ trước' for a time 2 hours ago", () => {
        const twoHoursAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 2);
        expect(DifferenceTime(twoHoursAgo)).toBe("2 giờ trước");
    });

    it("should return '3 ngày trước' for a time 3 days ago", () => {
        const threeDaysAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3);
        expect(DifferenceTime(threeDaysAgo)).toBe("3 ngày trước");
    });

    it("should return '4 tháng trước' for a time 4 months ago", () => {
        const fourMonthsAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 4);
        expect(DifferenceTime(fourMonthsAgo)).toBe("4 tháng trước");
    });

    it("should return '5 năm trước' for a time 5 years ago", () => {
        const fiveYearsAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 12 * 5);
        expect(DifferenceTime(fiveYearsAgo)).toBe("5 năm trước");
    });

    it("should handle the current time as input", () => {
        const currentTime = new Date();
        expect(DifferenceTime(currentTime)).toBe("Vừa xong");
    });

    it("should return '1 phút trước' for a time 61 seconds ago", () => {
        const oneMinuteAgo = new Date(new Date().getTime() - 61000);
        expect(DifferenceTime(oneMinuteAgo)).toBe("1 phút trước");
    });

    it("should handle a future time", () => {
        const futureTime = new Date(new Date().getTime() + 1000 * 60 * 60);
        expect(DifferenceTime(futureTime)).toBe("Vừa xong");
    });

    // Add more test cases...

    it("should return '12 tháng trước' for a time 1 year ago", () => {
        const oneYearAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 12);
        expect(DifferenceTime(oneYearAgo)).toBe("12 tháng trước");
    });

    it("should return '6 tháng trước' for a time 6 months ago", () => {
        const sixMonthsAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 6);
        expect(DifferenceTime(sixMonthsAgo)).toBe("6 tháng trước");
    });

    it("should return '30 ngày trước' for a time exactly 30 days ago", () => {
        const thirtyDaysAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30);
        expect(DifferenceTime(thirtyDaysAgo)).toBe("30 ngày trước");
    });

    it("should return '10 giờ trước' for a time exactly 10 hours ago", () => {
        const tenHoursAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 10);
        expect(DifferenceTime(tenHoursAgo)).toBe("10 giờ trước");
    });
});
