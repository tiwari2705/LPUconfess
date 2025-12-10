import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

// Verify token is available
if (!process.env.UPLOADTHING_TOKEN) {
  console.error("UPLOADTHING_TOKEN is not set in environment variables")
}

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})

