terraform {
  backend "s3" {
    bucket         = "tf-state-vibecheck-prod"
    key            = "application/terraform.tfstate"
    region         = "us-east-1"
    use_lockfile   = true
    encrypt        = true
  }
}
