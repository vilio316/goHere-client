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
import DashLayout from './DashboardLayout.tsx'
import Dashboard from './components/OwnerDashboard.tsx'
import PaymentsAndSubs from './components/DashboardPayments.tsx'
import DashboardListings from './components/DashboardListings.tsx'
import ForgotPassword from './components/auth/ForgotPassword.tsx'

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
    path: '/owner', 
    Component: DashLayout,
    children: [
      {
        index: true, Component: Dashboard, errorElement: <ErrorPage/>
      }, 
      {
        path: 'payments-and-subscriptions', Component: PaymentsAndSubs, errorElement: <ErrorPage/>
      }, 
      {
        path: 'listings', Component: DashboardListings, errorElement: <ErrorPage/>
      }
    ]
  },
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        path:'sign-in', Component: Login, errorElement: <ErrorPage />
      }, 
      { path: 'sign-up', Component: SignUp, errorElement:<ErrorPage/>}, 
      {
        path: 'forgot-password', Component: ForgotPassword, errorElement: <ErrorPage/>
      }

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
