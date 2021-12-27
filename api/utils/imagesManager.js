const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const mimeTypes = require("mimetypes");

const bucketName = "cdn-dssa-static-gcs";

exports.uploadImage = async (image, imageName, folderName) => {
  const storage = new Storage({
    keyFilename: "gcskey.json",
  });

  console.log({ text: "subir imagen" })

  const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
  const fileName = `${imageName}.` + mimeTypes.detectExtension(mimeType);
  const base64EncodedImageString = image.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const imageCloudPath = `hra/hrapp/public/${folderName}${fileName}`;
  console.log({ text: `mimeType: ${mimeType}\nimageCloudPath: ${imageCloudPath}` })

  const bucket = storage.bucket(bucketName);
  console.log({ text: "bucket" })

  const file = bucket.file(imageCloudPath);
  console.log({ text: "file" })

  const bufferStream = new stream.PassThrough();

  bufferStream.end(Buffer.from(base64EncodedImageString, "base64"));
  console.log({ text: "bufferStream" })

  const result = await new Promise((resolve, reject) => {
    bufferStream
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: mimeType,
            metadata: {
              custom: "metadata",
            },
          },
          public: true,
          validation: "md5",
        })
      )
      .on("error", async (error) => {
        console.log({ text: `error.name: ${error.name}\nerror.message: ${error.message}` })

        reject(error);
      })
      .on("finish", async () => {
        console.log({ text: "subida" })

        return resolve(
          `https://storage.googleapis.com/${bucketName}/${imageCloudPath}`
        );
      });
  });
  return result;
};

exports.deleteFolder = async (folderName) => {
  const storage = new Storage({
    keyFilename: "gcskey.json",
  });
  const bucket = storage.bucket(bucketName);
  const imageCloudPath = `hra/hrapp/public/${folderName}/`;

  await new Promise((resolve, reject) => {
    bucket.deleteFiles({ prefix: imageCloudPath }, (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};
