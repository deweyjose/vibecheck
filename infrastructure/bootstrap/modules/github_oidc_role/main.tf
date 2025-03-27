resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = {    
    env = var.env
  }
}

resource "aws_iam_role" "github_actions" {
  name = "github-actions-terraform"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Action    = "sts:AssumeRoleWithWebIdentity",
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        },
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:${var.sub_match}"
          },
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    env = var.env
  }
}

resource "aws_iam_role_policy" "github_policy" {
  name   = "github-actions-terraform-policy"
  role   = aws_iam_role.github_actions.id
  policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        "Effect": "Allow",
        "Action": [
          "iam:GetOpenIDConnectProvider",         
        ],
        "Resource": "arn:aws:iam::${local.effective_account_id}:oidc-provider/token.actions.githubusercontent.com"
      },      
      {
        Effect   = "Allow",
        Action   = [
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:HeadObject",
          "s3:PutObject"
        ],
        Resource = [
          "arn:aws:s3:::tf-state-vibecheck-${var.env}",
          "arn:aws:s3:::tf-state-vibecheck-${var.env}/*"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
          "s3:CreateBucket",
          "s3:HeadBucket",
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetBucketTagging",
          "s3:PutBucketTagging",
          "s3:GetBucketVersioning",
          "s3:PutBucketVersioning",
          "s3:GetBucketPolicy",
          "s3:PutBucketPolicy"
        ],
        "Resource": "*"
      }
    ]
  })
}

data "aws_caller_identity" "current" {
  count = var.account_id == "" ? 1 : 0
}

locals {
  effective_account_id = var.account_id != "" ? var.account_id : data.aws_caller_identity.current[0].account_id
}

