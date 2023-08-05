const core = require("@actions/core");
const fs = require("fs");
const yaml = require("js-yaml");

const addOptionsMethod = (yamlData) => {
  console.log(yamlData);
  for (const path in yamlData.paths) {
    const endpoint = yamlData.paths[path];
    let xGoogleBackEnd = "";

    if (endpoint.get) {
      xGoogleBackEnd = endpoint.get["x-google-backend"].address;
    } else if (endpoint.post) {
      xGoogleBackEnd = endpoint.post["x-google-backend"].address;
    } else if (endpoint.put) {
      xGoogleBackEnd = endpoint.put["x-google-backend"].address;
    } else if (endpoint.patch) {
      xGoogleBackEnd = endpoint.patch["x-google-backend"].address;
    } else if (endpoint.delete) {
      xGoogleBackEnd = endpoint.delete["x-google-backend"].address;
    }

    if (!endpoint.options) {
      endpoint.options = {
        description: "Cors associated request to retried",
        operationId: "governence cors",
        "x-google-backend": {
          address: xGoogleBackEnd,
        },
        responses: {
          200: { description: "Allow" },
          401: { description: "Cors not allowed" },
        },
      };
    }
  }
};

try {
  const inputFile = core.getInput("input-file-path");
  const outputFile = core.getInput("output-file-path");

  const data = fs.readFileSync(inputFile, "utf8");
  const yamlData = yaml.load(data);

  // Add the options method to the YAML data
  addOptionsMethod(yamlData);
  // Convert the YAML data back to a string
  const updatedYaml = yaml.dump(yamlData);
  // Save the updated YAML data back to the file
  fs.writeFileSync(outputFile, updatedYaml, "utf8");
  console.log("Options method added successfully!");
} catch (err) {
  console.error("Error reading/parsing the YAML:", err);
}
