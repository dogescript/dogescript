import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

jest.setTimeout(10000)

const binaryLocation = path.join(__dirname, "..", "dist", "dogescript.js");
const srcFile = fs.readFileSync(binaryLocation, { encoding: "utf-8" });


// Bit smelly, attaches a `onLoadPromise` to an el.
// This promise resolves once el's `onload` function has been called
function attachOnLoadPromise(el) {
    // Unwrap the promise
    let resolve;
    const onLoadProm = new Promise((r) => {
        resolve = r;
    })

    // Resolve the promise
    el.onload = function () {
        resolve();
    }

    // Attach the promise to the element
    el.onLoadPromise = onLoadProm;

    return el;
}


// Creates a script tag on the window's body and resolves when the script is loaded
function createScriptTagFromSrc(window, src, el=null) {
    const scriptEl = attachOnLoadPromise(el || window.document.createElement("script"));

    scriptEl.textContent = src;
    window.document.body.appendChild(scriptEl);
    return scriptEl;
}


async function createDogescriptTag(window, src) {
    const scriptEl = window.document.createElement("script");
    scriptEl.type = "text/dogescript";

    return createScriptTagFromSrc(window, src, scriptEl);
}


function createWindow(html="") {
    return new JSDOM(html, { runScripts: "dangerously", resources: "usable"}).window;
}


describe("Browser Tests:", () => {
    const pTagId = "🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕🐕"

    describe("window.onLoad", () => {
        it("should execute dogescript that's already on the DOM", async () => {
            const testString = "Hello World";
            const window = createWindow();

            // Create a p element on the window for querying upon in dogescript
            const pElement = window.document.createElement("p");
            window.document.body.appendChild(pElement);

            pElement.id = pTagId;

            // Create a dogescript tag that sets the innerHTML of the ptag to "hello world"
            const djsScript = createDogescriptTag(
                window,
                `
                very pElem is dogeument dose getElementById with '${pTagId}'
                pElem giv innerHTML is '${testString}'
                `
            );

            // Create the dogescript parser tag
            const parserTag = createScriptTagFromSrc(window, srcFile);

            // Wait for the parser tag to finished computing
            await parserTag.onLoadPromise;

            // Wait for djs tag to finished computing
            await djsScript.onLoadPromise;

            // Assert that the djs tag has modified the ptag in the correct way
            expect(pElement.innerHTML).toEqual(testString);
        });
    });
});
