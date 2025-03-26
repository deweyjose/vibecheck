module "github_oidc_role" {
  source      = "../../modules/github_oidc_role"
  github_org  = var.github_org
  github_repo = var.github_repo
  sub_match   = "*"  # or use a stricter pattern if desired
  env         = var.env
  aws_region  = var.aws_region
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
