import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import SuperApp from './SuperApp.tsx'
import { LocationDetails } from './components/LocationDetails.tsx'
import { LocationProvider } from './contexts/LocationContext.tsx'
import ViewAll from './components/SeeMorePage.tsx'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    Component: SuperApp,
    children: [
      {index: true, Component: App},
      {
        path: '/results', Component: ViewAll
      }

   ]
  },
  {
    path: '/location/:lat/:long',
    children: [
      {
        index: true, Component: LocationDetails
      }
    ]
  },
  
  
])


createRoot(document.getElementById('root')!).render(
    <LocationProvider>
    <RouterProvider router={browserRouter}/>
  </LocationProvider>
)
