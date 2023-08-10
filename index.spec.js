jest.mock('@actions/core')
jest.mock('./lib/generate-hash-id')

const core = require('@actions/core')
const fs = require('fs')
const main = require('./lib/converter')
const generateHashId = require('./lib/generate-hash-id')

const INPUT_FILE_PATH = './test/input.yaml'
const OUTPUT_FILE_PATH = './test/output.yaml'
const EXPECTED_OUTPUT_FILE_PATH = './test/expected-output.yaml'

core.getInput = jest.fn().mockImplementation((input) => {
    if (input === 'input-file-path') {
        return INPUT_FILE_PATH
    } else if (input === 'output-file-path') {
        return OUTPUT_FILE_PATH
    }
})

generateHashId.mockReturnValue('my-generated-id')

describe(`Conversion`, () => {
    afterAll(() => {
        fs.rmSync(OUTPUT_FILE_PATH)
    })

    it(`should convert file correctly`, () => {
        main()

        const actualOutput = fs.readFileSync(OUTPUT_FILE_PATH, 'utf8')
        const expectedOutput = fs.readFileSync(EXPECTED_OUTPUT_FILE_PATH, 'utf8')

        expect(actualOutput).toEqual(expectedOutput)
    })
})