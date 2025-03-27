terraform {
  backend "s3" {
    bucket         = "tf-state-bootstrap-vibecheck-prod"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    use_lockfile   = true
    encrypt        = true
  }
}
