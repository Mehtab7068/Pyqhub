import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadToS3 = async (buffer, key, contentType) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });
    await s3Client.send(command);
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const getKeyFromS3Url = (url) => {
    const prefix = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    if (url.startsWith(prefix)) {
        return url.slice(prefix.length);
    }
    return url;
};

export const getSignedS3Url = async (urlOrKey) => {
    const key = getKeyFromS3Url(urlOrKey);
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export default s3Client;