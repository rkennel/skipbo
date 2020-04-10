module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/unit/**/*.test.ts"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: ["/node_modules/", "/src/unit/", "/src/e2e"]
};
