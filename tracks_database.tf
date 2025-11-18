provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "tracks" {
  name         = "Tracks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "TracksTable"
  }
}