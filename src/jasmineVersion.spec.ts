beforeAll(() => {
    console.log("Running Jasmine " + getJasmineVersion() + ".");
});


describe("jasmine", () => {


    it("version will be printed while running the unit tests", () => {
        expect(getJasmineVersion()).toBe("2.8.0");
    });


});


function getJasmineVersion(): string {
    return (jasmine as any).version || jasmine.getEnv().versionString();
}
