import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import SuperApp from './SuperApp.tsx'
import { LocationDetails } from './components/LocationDetails.tsx'
import { LocationProvider } from './contexts/LocationContext.tsx'
import ViewAll from './components/SeeMorePage.tsx'
import Login from './components/auth/LoginPage.tsx'
import ErrorPage from './components/ErrorPage.tsx'
import AuthLayout from './AuthLayout.tsx'
import SignUp from './components/auth/SignUp.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import ProfilePage from './components/ProfilePage.tsx'
import ToastProvider from './contexts/ToastContext.tsx'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    Component: SuperApp,
    children: [
      {index: true, Component: App, errorElement: <ErrorPage />},
      {
        path: '/results', Component: ViewAll, errorElement: <ErrorPage />
      },
      {
        path: '/me', Component: ProfilePage, errorElement: <ErrorPage />
      },
      {path: '/location/:lat/:long', Component: LocationDetails, errorElement: <ErrorPage /> },
   ],
  },
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        path:'sign-in', Component: Login, errorElement: <ErrorPage />
      }, 
      { path: 'sign-up', Component: SignUp, errorElement:<ErrorPage/>}

    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <LocationProvider>
      <ToastProvider >
    <RouterProvider router={browserRouter}/>
    </ToastProvider>
  </LocationProvider>
  </AuthProvider>
)
