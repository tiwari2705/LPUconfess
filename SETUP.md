# LPUconfess Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Database**
   - Create a PostgreSQL database
   - Update `DATABASE_URL` in `.env`
   - Run: `npm run db:push`

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
   - Add your database URL

4. **Create Admin User**
   ```bash
   npm run db:seed
   # OR
   npm run create-admin
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Image Upload Setup

### Option 1: UploadThing (Recommended)

1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Get your API keys
3. Add to `.env`:
   ```
   UPLOADTHING_SECRET=your-secret
   UPLOADTHING_APP_ID=your-app-id
   ```
4. Follow instructions in `lib/uploadthing.ts`

### Option 2: Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your API keys
3. Add to `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. Install: `npm install cloudinary`
5. Uncomment Cloudinary code in `app/api/upload/route.ts`

## Production Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Database

- Use Vercel Postgres, Supabase, or Railway
- Update `DATABASE_URL` in production environment

## Troubleshooting

- **Database errors**: Run `npx prisma generate` and `npm run db:push`
- **Auth errors**: Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
- **Upload errors**: Configure UploadThing or Cloudinary

