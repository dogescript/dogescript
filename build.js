const dogescript = require("dogescript");
const fs = require("fs");

const srcDir = "./src";
const distDir = "./dist";

try {
	fs.mkdirSync(distDir);
} catch(e) {}

const files = fs.readdirSync(srcDir);

files.forEach(function(file) {
	if(file.endsWith(".djs")) {
		const sourceFilename = srcDir + "/" + file;
		const targetFilename = distDir + "/" + file.substring(0, file.length - 4) + ".js";

		const content = fs.readFileSync(sourceFilename, "utf-8");
		const transpiled = dogescript(content);

		fs.writeFileSync(targetFilename, transpiled);
	}
});
