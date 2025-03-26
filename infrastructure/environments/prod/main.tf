module "github_oidc_role" {
  source      = "../../modules/github_oidc_role"
  github_org  = var.github_org
  github_repo = var.github_repo
  sub_match   = "*"  # adjust if you want a stricter ref pattern
  env         = var.env

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
          "iam:ListRolePolicies",
          "iam:GetRolePolicy",
          "iam:ListAttachedRolePolicies",
        
        ],
        Resource = "arn:aws:iam::${module.github_oidc_role.effective_account_id}:role/github-actions-terraform"
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
          "arn:aws:s3:::tf-state-vibecheck-${var.env}",
          "arn:aws:s3:::tf-state-vibecheck-${var.env}/*"
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

resource "aws_s3_bucket" "tf_state_bucket" {
  bucket = "vibecheck-test-${var.env}"
  force_destroy = true
  tags = {
    env = var.env
  }
}

resource "aws_s3_bucket_versioning" "tf_state_bucket_versioning" {
  bucket = aws_s3_bucket.tf_state_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}
