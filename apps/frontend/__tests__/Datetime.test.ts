import { describe, expect, it } from "@jest/globals"
import { formatTime } from "@/utils/DateTime"

describe("datetime module", () => {
    it("formats a time correctly", () => {
        expect(formatTime(10)).toBe("00:10")
    });
})


