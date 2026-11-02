// const { data: { session } } = await supabase.auth.getSession();

// if (session) {
//   // User is already logged in. Show the booking grid.
//   console.log('Logged in as:', session.user.email);
//   // You can fetch the user's profile from public.users if needed
// } else {
//   // No session. Show the login/signup forms.
//   console.log('Not logged in');
// }

// async function logout() {
//   await supabase.auth.signOut();
//   window.location.reload(); // Or show the login form
// }

import { supabase } from './supabase-client.js'

export async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = '/ui/login.html'
}