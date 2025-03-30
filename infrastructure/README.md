# Infrastructure

This directory contains the Terraform configurations for the Vibecheck infrastructure. The setup follows a modular approach with separate environments and a bootstrap process for initial AWS setup.

## Directory Structure

```
infrastructure/
├── bootstrap/                  # One-time AWS setup for GitHub Actions
│   ├── dev/                    # Dev environment bootstrap
│   │   ├── backend.tf          # S3 backend configuration
│   │   ├── main.tf             # Main bootstrap configuration
│   │   └── variables.tf        # Bootstrap variables
│   ├── prod/                   # Prod environment bootstrap
│   │   ├── backend.tf          # S3 backend configuration
│   │   ├── main.tf             # Main bootstrap configuration
│   │   └── variables.tf        # Bootstrap variables
│   └── modules/                # Shared bootstrap modules
│       └── github_oidc_role/   # GitHub Actions OIDC role module
├── environments/               # Main infrastructure
│   ├── dev/                    # Development environment
│   │   ├── backend.tf          # S3 backend configuration
│   │   ├── main.tf             # Main configuration
│   │   └── variables.tf        # Environment variables
│   └── prod/                   # Production environment
│       ├── backend.tf          # S3 backend configuration
│       ├── main.tf             # Main configuration
│       └── variables.tf        # Environment variables
└── modules/                    # Shared infrastructure modules
    └── [module-name]/          # Individual infrastructure modules
```

## Prerequisites

1. AWS CLI installed and configured with appropriate profiles:
   - `vibecheck-dev` for development
   - `vibecheck-prod` for production
2. Terraform v1.2.0 or newer installed
3. GitHub repository configured with:
   - `AWS_ACCOUNT_ID_DEV` secret (for development environment)
   - `AWS_ACCOUNT_ID_PROD` secret (for production environment)
   - Environments: `dev` and `prod`

## Initial Setup

### One-Time Bootstrap (Manual Process)

The bootstrap process is a one-time setup that creates the necessary AWS resources for GitHub Actions to authenticate and manage infrastructure. This is not part of the CI/CD pipeline and should only be run manually when setting up a new environment or when new AWS service permissions are needed.

1. Bootstrap the AWS environment:
   ```bash
   # For dev
   cd infrastructure/bootstrap/dev
   terraform init
   terraform apply

   # For prod
   cd infrastructure/bootstrap/prod
   terraform init
   terraform apply
   ```

2. Configure GitHub Actions:
   - Add the AWS account IDs as secrets to your GitHub repository
   - Set up environment protection rules if needed

Note: The GitHub Actions workflow automatically constructs the role ARN using the AWS account ID and a fixed role name (`github-actions-terraform`). No additional role ARN secret is needed.

### Adding New AWS Service Permissions

When new AWS services are needed for infrastructure management:

1. Update the IAM policy in `bootstrap/modules/github_oidc_role/main.tf`
2. Apply the changes to both environments:
   ```bash
   cd infrastructure/bootstrap/dev
   terraform apply

   cd infrastructure/bootstrap/prod
   terraform apply
   ```

Note: The bootstrap process is separate from the regular infrastructure deployment process. It's only used to set up and maintain the GitHub Actions authentication and permissions.

## Adding Application Infrastructure

This section describes how to add new application infrastructure (e.g., ECS clusters, RDS databases, S3 buckets) to your environments. This is different from the bootstrap infrastructure which handles GitHub Actions authentication.

1. Create a new module in `infrastructure/modules/`:
   ```bash
   mkdir -p infrastructure/modules/s3_bucket
   ```

2. Create the module files:
   ```hcl
   # infrastructure/modules/s3_bucket/main.tf
   resource "aws_s3_bucket" "bucket" {
     bucket = var.bucket_name
     
     tags = {
       Environment = var.environment
       Project     = "vibecheck"
     }
   }

   resource "aws_s3_bucket_versioning" "bucket_versioning" {
     bucket = aws_s3_bucket.bucket.id
     versioning_configuration {
       status = "Enabled"
     }
   }

   resource "aws_s3_bucket_server_side_encryption_configuration" "bucket_encryption" {
     bucket = aws_s3_bucket.bucket.id
     rule {
       apply_server_side_encryption_by_default {
         sse_algorithm = "AES256"
       }
     }
   }

   # infrastructure/modules/s3_bucket/variables.tf
   variable "bucket_name" {
     description = "Name of the S3 bucket"
     type        = string
   }

   variable "environment" {
     description = "Environment name (e.g., dev, prod)"
     type        = string
   }

   # infrastructure/modules/s3_bucket/outputs.tf
   output "bucket_name" {
     description = "Name of the created S3 bucket"
     value       = aws_s3_bucket.bucket.id
   }

   output "bucket_arn" {
     description = "ARN of the created S3 bucket"
     value       = aws_s3_bucket.bucket.arn
   }
   ```

3. Add the module to your environment:
   ```hcl
   # infrastructure/environments/dev/main.tf
   module "user_uploads" {
     source = "../../modules/s3_bucket"
     
     bucket_name = "vibecheck-user-uploads-dev"
     environment = "dev"
   }

   # infrastructure/environments/prod/main.tf
   module "user_uploads" {
     source = "../../modules/s3_bucket"
     
     bucket_name = "vibecheck-user-uploads-prod"
     environment = "prod"
   }
   ```

4. Create a pull request with your changes

Note: This is for adding new application infrastructure. If you need to add new AWS service permissions for GitHub Actions, see the "Adding New AWS Service Permissions" section above.

## Workflow

The infrastructure deployment process is automated through GitHub Actions:

1. **On Any Push**:
   - Workflow automatically triggers on any branch push
   - Environment is determined by branch:
     - `main` branch → Production
     - All other branches → Development

2. **Plan Phase**:
   - Checks out code
   - Configures AWS credentials using OIDC
   - Initializes Terraform
   - Runs `terraform plan` with detailed exit code
   - Uploads plan as artifact if changes detected
   - Exit codes:
     - `0`: No changes needed
     - `2`: Changes detected (proceeds to approval/apply)
     - Other: Error occurred

3. **Approval Phase** (Development only):
   - Creates an issue for manual approval
   - Waits for approval from specified approvers
   - Not required for production (main branch)

4. **Apply Phase**:
   - Downloads the saved plan
   - Applies changes using `terraform apply -auto-approve`
   - Only runs if:
     - Changes were detected (exit code 2)
     - AND either:
       - It's the main branch (production)
       - OR approval was granted (development)

5. **No-Op Phase**:
   - Runs if no changes were detected
   - Confirms infrastructure is up-to-date

Note: The workflow is designed with a "fail fast" approach in development. All changes must be thoroughly reviewed and approved in dev first, ensuring any issues are caught early. Once changes are proven in dev and merged to main, production deployments are automated without additional approvals. This creates a smooth path to production while maintaining quality and safety.

## State Management

- Application infrastructure state files are stored in S3:
  - Dev: `tf-state-vibecheck-dev`
  - Prod: `tf-state-vibecheck-prod`
- Bootstrap infrastructure state files are stored in separate S3 buckets:
  - Dev: `vibecheck-bootstrap-dev`
  - Prod: `vibecheck-bootstrap-prod`
- All state files are stored with versioning enabled
- Never modify state files directly
- Use `terraform import` for existing resources

## Security

- GitHub Actions uses OIDC for secure authentication
- Separate roles for dev and prod environments
- Environment protection rules in GitHub
- Limited IAM permissions per environment

## Best Practices

1. **Module Development**:
   - Keep modules reusable and generic
   - Use variables for configurable values
   - Document all inputs and outputs
   - Include examples in module documentation

2. **State Management**:
   - Never modify state files directly
   - Use `terraform import` for existing resources
   - Keep state files in S3 with versioning enabled
   - Use separate state files for each environment

3. **Security**:
   - Follow least privilege principle
   - Use separate AWS accounts for dev/prod
   - Enable audit logging
   - Regular security reviews

4. **Cost Management**:
   - Use cost estimation in plans
   - Tag all resources appropriately
   - Regular cost reviews
   - Clean up unused resources

## Troubleshooting

1. **State Issues**:
   - Check S3 bucket versioning for state file history
   - Verify S3 bucket permissions
   - Review state file contents in S3
   - If state is locked, use force-unlock:
     ```bash
     # Get the lock ID from the error message
     terraform force-unlock <LOCK_ID>
     ```

2. **Permission Issues**:
   - Verify AWS credentials
   - Check IAM role permissions
   - Review GitHub Actions logs

3. **Plan Failures**:
   - Check for syntax errors
   - Verify variable values
   - Review provider configuration
