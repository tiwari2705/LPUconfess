# LPUconfess

A complete, production-ready anonymous confession platform with a beautiful dark-themed UI, anonymous posting, admin moderation, and full authentication system.

## 🚀 Features

- **Anonymous Confessions**: Users can post confessions without revealing their identity
- **Beautiful Dark UI**: Modern dark-themed interface with subtle snowflake patterns
- **Search Functionality**: Search through confessions easily
- **Sort Options**: View confessions by "Newest" or "Trending" (by engagement)
- **Quick Post**: Post confessions directly from the feed
- **Like & Comment**: Interact with confessions anonymously
- **Report System**: Report inappropriate content
- **Admin Dashboard**: Full moderation panel for user approval and content management
- **Secure Authentication**: NextAuth with credentials provider
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider)
- **Image Upload**: UploadThing / Cloudinary (configurable)
- **UI Components**: ShadCN UI
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) UploadThing or Cloudinary account for image uploads

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lpuconfess
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/lpuconfess?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

   # UploadThing (Optional)
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"

   # Cloudinary (Optional - alternative to UploadThing)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # App
   NODE_ENV="development"
   ```

4. **Generate NextAuth secret**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output to `NEXTAUTH_SECRET` in your `.env` file.

5. **Set up the database**
   ```bash
   # Push Prisma schema to database
   npx prisma db push

   # Generate Prisma Client
   npx prisma generate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```
   This creates a default admin user:
   - Email: `admin@lpuconfess.com`
   - Password: `admin123`
   - **⚠️ Change this password immediately after first login!**

7. **Create admin user (alternative)**
   ```bash
   npx tsx scripts/create-admin.ts
   ```

8. **Run the development server**
   ```bash
   npm run dev
   ```

9. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
lpuconfess/
├── app/
│   ├── api/
│   │   ├── admin/          # Admin API routes
│   │   ├── auth/           # Authentication routes
│   │   ├── confession/     # Confession CRUD routes
│   │   └── upload/         # Image upload route
│   ├── admin/              # Admin dashboard pages
│   ├── confession/         # Confession detail pages
│   ├── feed/               # Main feed page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── pending/            # Pending approval page
├── components/
│   ├── ui/                 # ShadCN UI components
│   ├── navbar.tsx          # Navigation component
│   └── providers.tsx       # NextAuth provider
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── middleware.ts       # Auth middleware
│   ├── prisma.ts           # Prisma client
│   ├── validations.ts      # Zod schemas
│   ├── sanitize.ts         # XSS protection
│   └── hash.ts             # User ID hashing
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seed script
└── scripts/
    └── create-admin.ts    # Admin creation script
```

## 🎨 UI Features

- **Dark Theme**: Beautiful black background with subtle snowflake patterns
- **Header Navigation**: Logo, search bar, and login button
- **Main Feed**: Post input, sort buttons, and confession cards
- **Sidebar**: Information section with links to User Agreement, Privacy Policy, Contact, and About Us
- **Confession Cards**: Dark gray cards with like and comment buttons
- **Responsive Layout**: Sidebar hidden on mobile, full layout on desktop

## 🔐 User Flow

1. **Registration**: User creates account (with optional ID verification)
2. **Pending**: User waits for admin approval (if verification required)
3. **Approved**: User can log in and post confessions
4. **Confession**: User posts anonymous confessions directly from feed or dedicated page
5. **Interaction**: Users can like, comment, and report confessions
6. **Search & Sort**: Users can search confessions and sort by newest or trending
7. **Moderation**: Admins review and manage content

## 👨‍💼 Admin Features

- View and approve/reject user registrations
- View reported confessions
- Remove inappropriate content
- Ban/unban users
- View platform statistics

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Set up database**
   - Use Vercel Postgres or any PostgreSQL provider
   - Update `DATABASE_URL` in Vercel environment variables
   - Run migrations: `npx prisma db push`

4. **Configure environment variables in Vercel**
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your Vercel domain)
   - `NEXTAUTH_SECRET`
   - Upload service credentials (if using)

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔒 Security Features

- Password hashing with bcrypt
- XSS protection with input sanitization
- Anonymous user IDs (hashed)
- Server-side authentication checks
- Admin-only routes protection
- Input validation with Zod

## 📝 API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (via NextAuth)
- `GET /api/auth/checkStatus` - Check user approval status

### Confessions
- `POST /api/confession/create` - Create confession
- `GET /api/confession/list?sort=newest|trending&search=query` - List confessions with sorting and search
- `GET /api/confession/[id]` - Get confession details
- `POST /api/confession/like` - Like/unlike confession
- `POST /api/confession/comment` - Add comment
- `POST /api/confession/report` - Report confession

### Admin
- `GET /api/admin/users` - List users
- `POST /api/admin/approve` - Approve user
- `POST /api/admin/reject` - Reject user
- `POST /api/admin/banUser` - Ban/unban user
- `POST /api/admin/removeConfession` - Remove confession
- `GET /api/admin/reports` - List reports
- `GET /api/admin/stats` - Get platform statistics

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` format
- Run `npx prisma db push` to sync schema

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Image Upload Issues
- Set up UploadThing or Cloudinary
- Update environment variables
- Check file size limits

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 📖 What This Project Does

**LPUconfess** is an anonymous confession platform that allows users to:

1. **Share Secrets Anonymously**: Post your deepest, darkest secrets without worrying about anyone finding out your identity. All confessions are completely anonymous.

2. **Express Yourself Freely**: Be honest with strangers in a safe space where you can revel in questionable life choices without judgment.

3. **Interact Anonymously**: Like and comment on confessions while maintaining complete anonymity. No usernames, no profiles, just raw honesty.

4. **Discover Content**: 
   - **Search**: Find confessions by keywords
   - **Sort by Newest**: See the latest confessions first
   - **Sort by Trending**: See the most engaging confessions (by likes and comments)

5. **Moderation**: Admins can review and moderate content to ensure a safe environment for all users.

The platform features a beautiful dark-themed UI with a minimalist design, making it easy and comfortable to share your thoughts. The interface includes:
- A clean header with logo, search, and login
- A main feed with quick post functionality
- Sort options for better content discovery
- An informative sidebar
- Responsive design for all devices

Perfect for anyone who wants to confess their sins, share secrets, or simply express themselves without fear of judgment or identification.

---

**Built with ❤️ for honest confessions**

#   L P U c o n f e s s  
 