export const config = {
  dev: {
    username: "undagramelvisdev",
    password: "password",
    database: "undagramelvisdev",
    host: "undagramelvisdev.cqdaeo43zc4h.us-east-1.rds.amazonaws.com",
    dialect: "postgres",
    aws_region: "us-east-1",
    aws_profile: "udagram-dev",
    aws_media_bucket: "udagram-elvis-dev",
  },
  jwt: {
    secret: " ",
  },
  prod: {
    username: "",
    password: "",
    database: "udagram_prod",
    host: "",
    dialect: "postgres",
  },
};
