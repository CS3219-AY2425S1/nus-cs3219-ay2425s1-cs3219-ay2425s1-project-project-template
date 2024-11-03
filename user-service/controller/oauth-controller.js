import jwt from 'jsonwebtoken';
import { findUserByUsernameOrEmail, createUser } from '../model/repository.js';
import { formatUserResponse } from './user-controller.js';

export async function handleGithubCallback(req, res) {
  const { code } = req.query;

  try {
    // Exchange code for access token for user data
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenResponseData = await tokenResponse.json();
    const { access_token } = tokenResponseData;

    // Get user data and emails from GitHub
    const [githubUser, userEmailData] = await Promise.all([
      fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then((res) => res.json()),
      // necessary to get user's private email, public email is not always available
      fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then((res) => res.json()),
    ]);

    if (!githubUser.email && !userEmailData.length) {
      res.status(400).json({ error: 'No email found' });
      return;
    }

    const userEmail =
      githubUser.email || userEmailData.find((email) => email.primary).email;

    if (!githubUser.login || !userEmail) {
      res.status(400).json({ error: 'Invalid user data' });
      return;
    }

    // Find or create user
    let user = await findUserByUsernameOrEmail(githubUser.login, userEmail);
    if (!user) {
      try {
        user = await createUser(
          githubUser.login,
          userEmail,
          Math.random().toString(36), // temporary password
        );
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
          error: 'Failed to create user due to duplicate email or username',
        });
        return;
      }
    }

    // Generate JWT token
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '5d',
    });

    // Redirect to frontend with token
    res
      .status(200)
      .json({ data: { accessToken, ...formatUserResponse(user) } });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'OAuth failed' });
  }
}

// Similar implementation for Google OAuth
