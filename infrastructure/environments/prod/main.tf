resource "aws_s3_bucket" "example" {
  bucket = "vibecheck-test-${var.env}"

  tags = {    
    env = var.env
  }
}