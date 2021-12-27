const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const mimeTypes = require("mimetypes");

const axios = require("axios");

const bucketName = "cdn-dssa-static-gcs";

exports.uploadImage = async (image, imageName, folderName) => {
  const storage = new Storage({
    keyFilename: "gcskey.json",
  });

  console.log({ text: "subir imagen" })
  await axios.post(
    "https://hooks.slack.com/services/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",
    { text: "subir imagen" },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
  const fileName = `${imageName}.` + mimeTypes.detectExtension(mimeType);
  const base64EncodedImageString = image.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const imageCloudPath = `hra/hrapp/public/${folderName}${fileName}`;
  console.log({ text: `mimeType: ${mimeType}\nimageCloudPath: ${imageCloudPath}` })
  await axios.post(
    "https://hooks.slack.com/services/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",
    {
      text: `mimeType: ${mimeType}\nimageCloudPath: ${imageCloudPath}`,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const bucket = storage.bucket(bucketName);
  console.log({ text: "bucket" })
  await axios.post(
    "https://hooks.slack.com/services/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",
    {
      text: `bucket`,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const file = bucket.file(imageCloudPath);
  console.log({ text: "file" })
  await axios.post(
    "https://hooks.slack.com/services/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",
    {
      text: `file`,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const bufferStream = new stream.PassThrough();

  bufferStream.end(Buffer.from(base64EncodedImageString, "base64"));
  console.log({ text: "bufferStream" })
  await axios.post(
    "https://hooks.slack.com/services/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",
    {
      text: `bufferStream`,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

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
        console.log({ text: "error.name: ${error.name}\nerror.message: ${error.message}" })
        await axios.post(
          "https://hooks.slack.com/services/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",
          {
            text: `error.name: ${error.name}\nerror.message: ${error.message}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        reject(error);
      })
      .on("finish", async () => {
        console.log({ text: "subida" })
        await axios.post(
          "https://hooks.slack.com/services/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",
          {
            text: `subida`,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
