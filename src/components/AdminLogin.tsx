import { useState } from 'react';
import { signInWithPopup, signOut, type User } from 'firebase/auth';
import { ArrowLeft, Loader2, Lock, LogOut, ShieldAlert } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';

interface AdminLoginProps {
  currentUser: User | null;
  isAuthorizedAdmin: boolean;
  checkingRole: boolean;
  onBackToSite: () => void;
}

export function AdminLogin({
  currentUser,
  isAuthorizedAdmin,
  checkingRole,
  onBackToSite,
}: AdminLoginProps) {
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');

  async function handleGoogleLogin() {
    setAuthError('');
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to complete Google sign-in.';
      setAuthError(message);
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    setAuthError('');
    await signOut(auth);
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F8FAFC] px-4 py-8 text-[#1E293B]">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex min-h-[40px] items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0F294A]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      <main className="mx-auto my-8 w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F294A] text-white">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-[#0F294A]">
              Meridian Admin Console
            </h1>
            <p className="text-xs text-slate-500">
              Verified Google Workspace Authentication
            </p>
          </div>
        </div>

        {checkingRole ? (
          <div className="mt-8 flex items-center justify-center gap-2 py-8 text-sm text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-[#0F294A]" />
            <span>Verifying admin permissions...</span>
          </div>
        ) : currentUser && !isAuthorizedAdmin ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <h2 className="text-sm font-bold text-amber-950">
                    Admin Access Restricted
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-amber-900">
                    Signed in as <span className="font-mono font-semibold">{currentUser.email}</span>.
                    This account is not listed in the authorized Meridian operations directory.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-[#0F294A] hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out &amp; Switch Account</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <p className="text-sm leading-relaxed text-slate-600">
              Sign in with your authorized corporate Google account to access real-time order
              tracking, customer analytics, low-inventory alerts, Pipedrive CRM sync, and the
              landing page CMS.
            </p>

            {authError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {authError}
              </div>
            )}

            <button
              type="button"
              disabled={signingIn}
              onClick={handleGoogleLogin}
              className="flex min-h-[48px] w-full items-center justify-center gap-3 rounded-lg bg-[#0F294A] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1E293B] disabled:opacity-60"
            >
              {signingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            <div className="border-t border-slate-100 pt-4 text-xs text-slate-500">
              Protected by Firebase Authentication &amp; Firestore zero-trust RBAC rules.
            </div>
          </div>
        )}
      </main>

      <div className="text-center text-xs text-slate-400">
        Meridian Setup Operations · Internal Portal
      </div>
    </div>
  );
}
