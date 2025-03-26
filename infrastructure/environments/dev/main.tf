module "github_oidc_role" {
  source      = "../../modules/github_oidc_role"
  github_org  = var.github_org
  github_repo = var.github_repo
  sub_match   = "*"  # or use a stricter pattern if desired
  role_name   = "github-actions-terraform-dev"
  
  inline_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        "Effect": "Allow",
        "Action": [
          "iam:GetOpenIDConnectProvider",         
        ],
        "Resource": "arn:aws:iam::${module.github_oidc_role.effective_account_id}:oidc-provider/token.actions.githubusercontent.com"
      },
      {
        Effect = "Allow",
        Action = [
          "iam:GetRole",
          "iam:ListRolePolicies"
        ],
        Resource = "arn:aws:iam::${module.github_oidc_role.effective_account_id}:role/github-actions-terraform-dev"
      },
      {
        Effect   = "Allow",
        Action   = [
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        Resource = [
          "arn:aws:s3:::tf-state-vibecheck-dev",
          "arn:aws:s3:::tf-state-vibecheck-dev/*"
        ]
      },
      {
        Effect   = "Allow",
        Action   = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ],
        Resource = "arn:aws:dynamodb:${var.aws_region}:${module.github_oidc_role.effective_account_id}:table/terraform-locks"

      }
      # Add additional permissions as needed.
    ]
  })
}
