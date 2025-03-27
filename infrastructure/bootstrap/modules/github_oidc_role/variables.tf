variable "oidc_provider_name" {
  description = "Name tag for the OIDC provider."
  type        = string
  default     = "github-actions-oidc-provider"
}

variable "github_org" {
  description = "GitHub organization name."
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name."
  type        = string
}

variable "sub_match" {
  description = "Pattern for matching the subject in the OIDC token. For example, '*' or a specific branch reference."
  type        = string
  default     = "*"
}

variable "account_id" {
  description = "The AWS account ID (optional — auto-discovered if not set)."
  type        = string
  default     = ""
}

variable "env" {
  description = "The environment for the IAM role to be created."
  type        = string
}

variable "aws_region" {
  description = "AWS region for deployment."
  type        = string  
}