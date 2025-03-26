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
  description = "The GitHub repository name for dev."
  type        = string
  default     = "vibecheck"
}