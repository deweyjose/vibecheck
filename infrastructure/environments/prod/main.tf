module "github_oidc_role" {
  source      = "../../modules/github_oidc_role"
  github_org  = var.github_org
  github_repo = var.github_repo
  sub_match   = "*"  # adjust if you want a stricter ref pattern
  role_name   = "github-actions-terraform-prod"
  
  inline_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        Resource = [
          "arn:aws:s3:::tf-state-vibecheck-prod",
          "arn:aws:s3:::tf-state-vibecheck-prod/*"
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
      # Add additional prod-specific permissions if needed.
    ]
  })
}
