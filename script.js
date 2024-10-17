require("colors");
const fsPromise = require("fs").promises;
const path = require("path");
const AdmZip = require("adm-zip");

const unzipOne = (_folderName, _fileName) =>
	new Promise((res, rej) => {
		try {
			if (_fileName.slice(-4).toLowerCase() !== ".zip") {
				console.log();
				rej(`NOT A ZIPPED FILE... ${_fileName}`);
				return;
			}
			const zip = new AdmZip(
				path.join(__dirname, "unzip_from", _folderName, _fileName)
			);
			zip.extractAllTo(`./unzip_to/${_folderName}`, true);
			res(`${_fileName} IS ZIPPED COMPLETELY! `);
		} catch (error) {
			console.error(`ERROR UNIZIPING FILE ${_fileName}`.red);
			console.error(error);
			rej(error);
		}
	});

const unzipAll = async () => {
	try {
		const targetFolder = await fsPromise.readdir(
			path.join(__dirname, "unzip_from")
		);

		const targetFiles = await fsPromise.readdir(
			path.join(__dirname, "unzip_from", targetFolder[0])
		);

		console.log(`STARTING TO  UNZIP ${targetFiles.length} FILES ... `);

		const res = await Promise.allSettled(
			targetFiles.map((_fileName) => unzipOne(targetFolder[0], _fileName))
		);
		const unzippedFiles = res.filter((_data) => _data.status === "fulfilled");
		console.log(`SUCCESSFULLY UNZIPPED ${unzippedFiles.length} FILES`.green);
	} catch (err) {
		console.error("An error occurred:", err);
	}
};

unzipAll();
