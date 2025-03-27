terraform {
  backend "s3" {
    bucket         = "tf-state-bootstrap-vibecheck-dev"
    key            = "terraform.tfstate"
    use_lockfile   = true
    region         = "us-east-1"    
    encrypt        = true
  }
}
