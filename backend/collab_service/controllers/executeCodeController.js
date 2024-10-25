const axios = require("axios");

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
});

const executeCode = async (req, res) => {
	try {
		const { language, code, langVer } = req.body;

		if (!language || !code || !langVer) {
			return res
				.status(400)
				.json({ message: "Language, code and langVer are required" });
		}

		const response = await API.post("/execute", {
			language: language,
			version: langVer[language],
			files: [
				{
					content: code,
				},
			],
		});

		res.status(200).json(response.data);
		return response.data;
	} catch (error) {
        console.error("Error executing code:", error); // Log the full error object
		res.status(500).send(error.message);
	}
};

module.exports = { executeCode };
