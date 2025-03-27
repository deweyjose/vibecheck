resource "aws_s3_bucket" "example" {
  bucket = "vibecheck-test-${var.env}"
  force_destroy = true

  tags = {    
    env = var.env
  }
}