'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Suiverify2000?';
const MAX_LOGIN_ATTEMPTS = 3;

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const authData = localStorage.getItem('suiverify_admin_auth');
    if (authData) {
      router.push('/admin');
    }

    // Get login attempts from localStorage
    const attempts = localStorage.getItem('suiverify_admin_login_attempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts, 10));
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check login attempts
      if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        setError('Too many failed login attempts. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Validate credentials
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('suiverify_admin_login_attempts');

        // Store auth session
        const authData = {
          username: ADMIN_USERNAME,
          timestamp: Date.now()
        };
        localStorage.setItem('suiverify_admin_auth', JSON.stringify(authData));

        // Redirect to admin
        router.push('/admin');
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('suiverify_admin_login_attempts', newAttempts.toString());
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isBlocked = loginAttempts >= MAX_LOGIN_ATTEMPTS;

  return (
    <div className="min-h-screen flex items-center justify-center outfit bg-ghost-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl mx-4 border-[3px] border-primary"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2 text-charcoal-text"
          >
            <span className="text-primary">Sui</span>Verify Admin
          </motion.h1>
          <p className="text-sm text-charcoal-text/70">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="username" className="block text-sm font-medium mb-2 text-charcoal-text">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-charcoal-text"
              placeholder="Enter your username"
              required
              disabled={isLoading || isBlocked}
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-charcoal-text">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-charcoal-text"
              placeholder="Enter your password"
              required
              disabled={isLoading || isBlocked}
            />
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg border bg-error/10 border-error/30"
            >
              <p className="text-sm text-charcoal-text">{error}</p>
              {!isBlocked && loginAttempts > 0 && (
                <p className="text-xs mt-1 text-charcoal-text/70">
                  Attempts: {loginAttempts}/{MAX_LOGIN_ATTEMPTS}
                </p>
              )}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || isBlocked}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : isBlocked ? (
                'Too Many Attempts'
              ) : (
                'Access Admin Panel'
              )}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-6 mt-6 border-t border-primary/40"
        >
          <p className="text-xs text-charcoal-text/60">
            SuiVerify Protocol Management
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
