export default {
    clearMocks: true,
    roots: ["<rootDir>/tests"],
    modulePathIgnorePatterns: ["<rootDir>/tests/test_utilities"],
    testEnvironment: "node",
    preset: "ts-jest",
    setupFiles: ["dotenv/config"]
};
