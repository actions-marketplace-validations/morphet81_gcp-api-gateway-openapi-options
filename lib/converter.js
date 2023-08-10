const core = require("@actions/core");
const fs = require("fs");
const yaml = require("js-yaml");
const generateHashId = require("./generate-hash-id")

const addOptions = (yamlData) => {
    for (const path in yamlData.paths) {
        const endpoint = yamlData.paths[path];
        let xGoogleBackEnd = "";
        let parameters = undefined;

        try {
            if (endpoint.get) {
                xGoogleBackEnd = endpoint.get["x-google-backend"].address;
                parameters = endpoint.get.parameters;
            } else if (endpoint.post) {
                xGoogleBackEnd = endpoint.post["x-google-backend"].address;
                parameters = endpoint.post.parameters;
            } else if (endpoint.put) {
                xGoogleBackEnd = endpoint.put["x-google-backend"].address;
                parameters = endpoint.put.parameters;
            } else if (endpoint.patch) {
                xGoogleBackEnd = endpoint.patch["x-google-backend"].address;
                parameters = endpoint.patch.parameters;
            } else if (endpoint.delete) {
                xGoogleBackEnd = endpoint.delete["x-google-backend"].address;
                parameters = endpoint.delete.parameters;
            }

            if (!endpoint.options) {
                endpoint.options = {
                    description: "Cors associated request to retried",
                    parameters: parameters.map((param) => {
                        const schema = param.schema;

                        return {
                            in: param.in,
                            name: param.name,
                            type: param.type,
                            required: param.required,
                            description: param.description,
                            ...(schema != undefined && { schema: JSON.parse(JSON.stringify(schema)) })
                        };
                    }),
                    operationId: generateHashId(xGoogleBackEnd),
                    "x-google-backend": {
                        address: xGoogleBackEnd,
                    },
                    responses: {
                        200: { description: "Allow" },
                        401: { description: "Cors not allowed" },
                    },
                };
            }
        } catch (err) {
            console.error(`Error reading/parsing the YAML for path "${path}":`, err);
        }
    }
};

const main = () => {
    try {
        const inputFile = core.getInput("input-file-path", { required: true });
        const outputFile = core.getInput("output-file-path", { required: true });

        const data = fs.readFileSync(inputFile, "utf8");
        const yamlData = yaml.load(data);

        addOptions(yamlData);

        const updatedYaml = yaml.dump(yamlData);

        fs.writeFileSync(outputFile, updatedYaml, "utf8");

        console.log(yamlData);
        console.log("Options method added successfully!");
    } catch (err) {
        console.error("Error reading/parsing the YAML:", err);
    }
}

module.exports = main