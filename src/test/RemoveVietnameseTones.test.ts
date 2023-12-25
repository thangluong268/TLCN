import RemoveVietnameseTones from "../utils/RemoveVietnameseTones";

describe("RemoveVietnameseTones", () => {
    it("should remove tones from lowercase vowels", () => {
        expect(RemoveVietnameseTones("àáạảã")).toBe("aaaaa");
    });

    it("should remove tones from uppercase vowels", () => {
        expect(RemoveVietnameseTones("ÀÁẠẢÃ")).toBe("AAAAA");
    });

    it("should remove tones from mixed case vowels", () => {
        expect(RemoveVietnameseTones("àÁẠảã")).toBe("aAAaa");
    });

    it("should remove tones from lowercase consonants", () => {
        expect(RemoveVietnameseTones("đ")).toBe("d");
    });

    it("should remove tones from uppercase consonants", () => {
        expect(RemoveVietnameseTones("Đ")).toBe("D");
    });

    it("should remove tones from mixed case consonants", () => {
        expect(RemoveVietnameseTones("đĐ")).toBe("dD");
    });

    it("should remove combining accents from vowels", () => {
        expect(RemoveVietnameseTones("àạ́ảã")).toBe("aaaa");
    });

    it("should remove combining accents from uppercase vowels", () => {
        expect(RemoveVietnameseTones("ÀẠ́ẢÃ")).toBe("AAAA");
    });

    it("should remove combining accents from mixed case vowels", () => {
        expect(RemoveVietnameseTones("àẠ́ảã")).toBe("aAaa");
    });

    it("should remove combining accents from consonants", () => {
        expect(RemoveVietnameseTones("đ̃")).toBe("d");
    });

    it("should remove combining accents from uppercase consonants", () => {
        expect(RemoveVietnameseTones("Đ̃")).toBe("D");
    });

    it("should remove combining accents from mixed case consonants", () => {
        expect(RemoveVietnameseTones("đ̃Đ")).toBe("dD");
    });

    it("should remove extra spaces and trim the string", () => {
        expect(RemoveVietnameseTones("  àáạảã  ")).toBe("aaaaa");
    });


    it("should handle an empty string", () => {
        expect(RemoveVietnameseTones("")).toBe("");
    });


    it("should handle a string with mixed Vietnamese and non-Vietnamese characters", () => {
        expect(RemoveVietnameseTones("aàáạảã 123!@#")).toBe("aaaaa 123");
    });

    it("should handle a string with combining accents only", () => {
        expect(RemoveVietnameseTones("àẠ́ảã")).toBe("aaaaa");
    });

    it("should handle a string with spaces and punctuations", () => {
        expect(RemoveVietnameseTones("àáạảã !@#%^*()+=<>?/,.:;'\"&#[]~$_`-{}|\\")).toBe("aaaaa");
    });

    // Add more test cases...

    it("should handle a string with digits", () => {
        expect(RemoveVietnameseTones("12345")).toBe("12345");
    });

    it("should handle a string with spaces between words", () => {
        expect(RemoveVietnameseTones("hồ Chí Minh")).toBe("ho Chi Minh");
    });

    it("should handle a string with combining accents on uppercase vowels", () => {
        expect(RemoveVietnameseTones("Ạ́")).toBe("A");
    });

    it("should handle a string with combining accents on lowercase vowels", () => {
        expect(RemoveVietnameseTones("ạ")).toBe("a");
    });
});
