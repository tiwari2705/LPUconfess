/**
 * Cloudinary Integration Example
 * 
 * To use Cloudinary:
 * 1. Install: npm install cloudinary
 * 2. Get API keys from https://cloudinary.com
 * 3. Update .env with CLOUDINARY_* variables
 * 4. Use this helper function in your upload route
 */

import { v2 as cloudinary } from "cloudinary"

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary not configured")
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "lpuconfess",
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result!.secure_url)
          }
        }
      )
      .end(buffer)
  })
}

