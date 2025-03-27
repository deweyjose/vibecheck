resource "aws_s3_bucket" "vibecheck_test_bucket" {
  bucket = "vibecheck-test-${var.env}"
  force_destroy = true
  tags = {
    env = var.env
  }
}

resource "aws_s3_bucket_versioning" "vibecheck_test_bucket_versioning" {
  bucket = aws_s3_bucket.vibecheck_test_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}
