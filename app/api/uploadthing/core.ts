import { createUploadthing, type FileRouter } from "uploadthing/next"

// UploadThing automatically reads UPLOADTHING_TOKEN from environment variables
const f = createUploadthing()

export const ourFileRouter = {
  idCardUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      // File uploaded successfully
      // Return file info including key for deletion
      return { 
        url: file.url,
        key: file.key 
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

