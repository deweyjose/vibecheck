output "oidc_provider_arn" {
  description = "ARN of the created OIDC provider."
  value       = aws_iam_openid_connect_provider.github.arn
}

output "github_role_arn" {
  description = "ARN of the GitHub Actions IAM role."
  value       = aws_iam_role.github_actions.arn
}

output "github_role_policy_name" {
  description = "Name of the GitHub Actions IAM role policy."
  value       = aws_iam_role_policy.github_policy.name
}

output "effective_account_id" {
  description = "Resolved AWS account ID (either from var or auto-discovered)"
  value       = local.effective_account_id
}