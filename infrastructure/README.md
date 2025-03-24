# VibeCheck Terraform Infrastructure

This repository contains Terraform configurations for setting up our GitHub OIDC integration and associated AWS IAM resources for VibeCheck. We manage separate environments for **dev** and **prod**—each with its own remote backend configuration (S3 for state and DynamoDB for state locking) and provider settings.

## Directory Structure

```
terraform/
├── modules/
│   └── github_oidc_role/
│       ├── main.tf          # Defines the OIDC provider, IAM role, and inline policy
│       ├── variables.tf     # Module input definitions (e.g., GitHub org, repo, role name)
│       └── outputs.tf       # Exposes resource ARNs (OIDC provider, IAM role)
└── environments/
    ├── dev/
    │   ├── backend.tf       # Remote state config for dev (S3 bucket & DynamoDB locking)
    │   ├── provider.tf      # AWS provider configuration for dev
    │   ├── main.tf          # Calls the github_oidc_role module with dev‑specific values
    │   ├── variables.tf     # Environment-specific variables for dev
    │   └── outputs.tf       # Outputs for dev (e.g., IAM role ARN)
    └── prod/
        ├── backend.tf       # Remote state config for prod
        ├── provider.tf      # AWS provider configuration for prod
        ├── main.tf          # Calls the github_oidc_role module with prod‑specific values
        ├── variables.tf     # Environment-specific variables for prod
        └── outputs.tf       # Outputs for prod
```

## Prerequisites

- **Terraform** (v1.0+ recommended)
- **AWS CLI v2** with SSO support
- AWS SSO configured with two profiles: `vibecheck-dev` and `vibecheck-prod`
- Remote backend resources (S3 buckets and DynamoDB tables for state locking) already created in each AWS account

## First-Time Setup

When you clone the repository for the first time, follow these steps:

### For the Dev Environment

1. **Set your AWS profile and login using SSO:**

   ```bash
   export AWS_PROFILE=vibecheck-dev
   aws sso login
   ```

2. **Navigate to the dev environment folder:**

   ```bash
   cd terraform/environments/dev
   ```

3. **Initialize Terraform:**

   ```bash
   terraform init
   ```

4. *(Optional)* **Preview the changes:**

   ```bash
   terraform plan
   ```

### For the Prod Environment

1. **Set your AWS profile and login using SSO:**

   ```bash
   export AWS_PROFILE=vibecheck-prod
   aws sso login
   ```

2. **Navigate to the prod environment folder:**

   ```bash
   cd terraform/environments/prod
   ```

3. **Initialize Terraform:**

   ```bash
   terraform init
   ```

4. *(Optional)* **Preview the changes:**

   ```bash
   terraform plan
   ```

## Additional Information

- **Backend Configuration:**  
  Each environment’s `backend.tf` file defines the S3 bucket and DynamoDB table for state storage and locking. These resources must exist before running `terraform init`.

- **Module Usage:**  
  The reusable module located in `modules/github_oidc_role/` handles the GitHub OIDC provider and IAM role creation. Environment‑specific values (e.g., GitHub organization, repository, and role name) are provided via the environment’s variable files.

- **Provider Settings:**  
  The AWS provider is configured in `provider.tf` using the environment’s AWS region (defined in `variables.tf`).

- **Variables & Outputs:**  
  Environment-specific variables are declared in `variables.tf` and outputs (such as the IAM role ARN) are defined in `outputs.tf` for reference and integration.

## Troubleshooting

- **SSO Issues:**  
  Ensure you run `aws sso login` with the correct profile before executing `terraform init`.

- **Debugging:**  
  If you encounter issues, run Terraform with debug logging:
  
  ```bash
  TF_LOG=DEBUG terraform init
  ```

## License

This repository is licensed under the [MIT License](LICENSE).
