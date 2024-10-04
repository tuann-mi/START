// import { useSession, signIn } from 'next-auth/react';

// export const useAuth = (router) => {
//   const { data: session, status } = useSession();

//   if (process.env.NODE_ENV === 'development') {
//     return { session: { user: { email: 'dev@example.com', name: 'User' } }, status: 'authenticated' };
//   }

//   // if prod or test env
//   if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
//     if (status === 'loading') return { session: null, status: 'loading' };
//     if (!session) {
//       console.log('User is not authenticated');
//       signIn('google', { callbackUrl: router.asPath });
//       return { session: null, status: 'unauthenticated' };
//     } else {
//       console.log('User is authenticated:', session.user.email);
//     }
//   }

//   return { session, status };
// };