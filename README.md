# OpenAPI 2.0 specifications converter for GCP

This action converts an API Specifications file to include CORS declarations required by GCP.

Was built as an adhoc solution for specific projec, so it might not fit all needs.

## Usage

To improve this action, clone it and install dependencies.

```
pnpm i
```

## Test

```
pnpm test
```

## Inputs

### `input-file-path`

**Required** input open-api yaml file path.

### `output-file-path`

**Required** output yaml file path.

> :warning: GCP API Gateway supports OpenAPI spec 2.0 at the time of writing this, however modern applications are using OpenAPI spec >3.0. Therefore to deploy with api gateway the OpenAPI spec can be converted to 2.0. However to support CORS, OPTIONS method should be specified in the spec. This GitHub Action appends OPTIONS to each endpoint specified in the OpenAPI spec.

MIT
