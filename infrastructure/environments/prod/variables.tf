variable "aws_region" {
  description = "AWS region for deployment."
  type        = string
  default     = "us-east-1"
}

variable "github_org" {
  description = "The GitHub organization name."
  type        = string
  default     = "deweyjose"
}

variable "github_repo" {
  description = "The GitHub repository name for prod."
  type        = string
  default     = "vibecheck"
}

variable "env" {
  description = "The environment for the infrastructure to be created."
  type        = string
  default     = "prod"
}