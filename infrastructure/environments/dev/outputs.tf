output "github_role_arn" {
  description = "ARN of the GitHub Actions IAM role for dev."
  value       = module.github_oidc_role.github_role_arn
}

output "oidc_provider_arn" {
  description = "ARN of the GitHub OIDC provider."
  value       = module.github_oidc_role.oidc_provider_arn
}

output "account_id" {
  description = "Resolved AWS account ID used by the module"
  value       = module.github_oidc_role.effective_account_id
}
