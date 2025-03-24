terraform {
  backend "s3" {
    bucket         = "tf-state-vibecheck-prod"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
