const dogescript = require("dogescript");
const fs = require("fs");

const srcDir = "./src";
const buildDir = "./build";
const distDir = "./dist";

try {
	fs.mkdirSync(buildDir);
	fs.mkdirSync(distDir);
} catch(e) {}

const files = fs.readdirSync(srcDir);

const LIB_FILES = ["parser.djs", "toJS.djs", "index.djs"];

function buildStage(name, dest, fn, libOnly) {
	try {
		fs.mkdirSync(dest);
	} catch(e) {}

	files.forEach(function(file) {
		if(file.endsWith(".djs") && (!libOnly || LIB_FILES.includes(file))) {
			console.log(name + ": Building " + file);
			const sourceFilename = srcDir + "/" + file;
			const targetFilename = dest + "/" + file.substring(0, file.length - 4) + ".js";

			const content = fs.readFileSync(sourceFilename, "utf-8");
			const transpiled = fn(content);

			fs.writeFileSync(targetFilename, transpiled);
		}
	});
}

buildStage("stage1", buildDir + "/stage1", dogescript, true);

const stage1 = require(buildDir + "/stage1");
buildStage("stage2", buildDir + "/stage2", stage1);

const stage2 = require(buildDir + "/stage2");
buildStage("dist", distDir, stage2);
