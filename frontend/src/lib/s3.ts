import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_ACCESS_KEY_SECRET}`,
  },
});

// export const s3Config = {
//   bucketName: "aiducation",
//   dirName: "course" /* Optional */,
//   region: "ap-southeast-1",
//   accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
//   secretAccessKey: `${process.env.AWS_ACCESS_KEY_SECRET}`,
//   s3Url: "https:/your-aws-s3-bucket-url/" /* Optional */,
// };

type nftCourse = {
  name: string;
  description: string;
  image?: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
};

export async function uploadJson(jsonData: nftCourse, tokenId: string) {
  const params = {
    Bucket: "aiducation",
    Key: `course/${tokenId}.json`,
    Body: JSON.stringify(jsonData),
    ContentType: "application/json",
  };

  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    console.log("Success", response);
    return response;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}
