import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_ID",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_SECRET",
    callbackURL: "http://localhost:2020/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { googleId: profile.id }
      });

      if (!user) {
        // Check if email exists to link accounts
        const existingUser = await prisma.user.findUnique({
            where: { email: profile.emails[0].value }
        });
        
        if (existingUser) {
            user = await prisma.user.update({
                where: { id: existingUser.id },
                data: { googleId: profile.id }
            });
        } else {
            user = await prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    role: 'CANDIDATE', // Default role
                    password: null // No password for OAuth users
                }
            });
            
             // Create Candidate Profile automatically
            await prisma.candidateprofile.create({
                data: {
                    userId: user.id,
                    firstName: profile.name.givenName || 'User',
                    lastName: profile.name.familyName || ''
                }
             })
        }
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || "PLACEHOLDER_ID",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "PLACEHOLDER_SECRET",
    callbackURL: "/api/auth/github/callback",
    scope: ['user:email']
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!email) return cb(new Error("No email found in GitHub profile"));

      let user = await prisma.user.findUnique({
        where: { githubId: profile.id }
      });

      if (!user) {
         const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
             user = await prisma.user.update({
                where: { id: existingUser.id },
                data: { githubId: profile.id }
            });
        } else {
            user = await prisma.user.create({
                data: {
                    email: email,
                    githubId: profile.id,
                    role: 'CANDIDATE',
                    password: null
                }
            });

            await prisma.candidateprofile.create({
                data: {
                    userId: user.id,
                    firstName: profile.displayName || profile.username || 'User',
                    lastName: ''
                }
             })
        }
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

// Serialize user for session (even if we use JWT, passport needs this if using session support, but we might skip session)
// Since we use JWT and no session, we might not strictly need serialize, but sometimes strategies expect it.
// Actually, we'll use { session: false } in the routes so this is optional.
