terraform {
  backend "s3" {
    bucket         = "tf-state-vibecheck-dev"
    key            = "bootstrap/terraform.tfstate"
    use_lockfile   = true
    region         = "us-east-1"    
    encrypt        = true
  }
}
