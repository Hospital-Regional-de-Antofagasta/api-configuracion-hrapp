const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const mimeTypes = require("mimetypes");

const bucketName = "cdn-dssa-static-gcs"; // TODO: deve ser variable de entorno

exports.uploadImage = async (image, imageName, folderName) => {
  const storage = new Storage({
    keyFilename: "gcskey.json",
  });

  const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
  const fileName = `${imageName}.` + mimeTypes.detectExtension(mimeType);
  const base64EncodedImageString = image.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const imageCloudPath = `hra/hrapp/public/${folderName}${fileName}`;

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(imageCloudPath);

  const bufferStream = new stream.PassThrough();

  bufferStream.end(Buffer.from(base64EncodedImageString, "base64"));

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
      .on("error", function (error) {
        reject(error);
      })
      .on("finish", function () {
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
