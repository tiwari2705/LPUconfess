/**
 * UploadThing Integration Example
 * 
 * To use UploadThing:
 * 1. Install: npm install @uploadthing/react @uploadthing/server
 * 2. Get API keys from https://uploadthing.com
 * 3. Create app/api/uploadthing/route.ts with:
 * 
 * import { createRouteHandler } from "@uploadthing/next"
 * import { ourFileRouter } from "./core"
 * 
 * export const { GET, POST } = createRouteHandler({
 *   router: ourFileRouter,
 * })
 * 
 * 4. Create app/api/uploadthing/core.ts with:
 * 
 * import { createUploadthing, type FileRouter } from "uploadthing/next"
 * 
 * const f = createUploadthing()
 * 
 * export const ourFileRouter = {
 *   imageUploader: f({ image: { maxFileSize: "4MB" } })
 *     .onUploadComplete(async ({ metadata, file }) => {
 *       return { url: file.url }
 *     }),
 * } satisfies FileRouter
 * 
 * export type OurFileRouter = typeof ourFileRouter
 */

export async function uploadToUploadThing(file: File): Promise<string> {
  // Implementation example
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/uploadthing", {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  return data.url
}

