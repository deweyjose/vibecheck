module "github_oidc_role" {
  source      = "../modules/github_oidc_role"
  github_org  = var.github_org
  github_repo = var.github_repo
  sub_match   = "*"  # or use a stricter pattern if desired
  env         = var.env
  aws_region  = var.aws_region
}
