import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ErrorPage from './components/ErrorPage.tsx'
import SuperApp from './SuperApp.tsx'
import MapTest from './components/MapTestComponent.tsx'

const browserRouter = createBrowserRouter([
  {
    path: '/home',
    Component: SuperApp,
    children: [
      {index: true, Component: App},
      {path: "error", Component: ErrorPage} 
   ]
  },
  {
    path : '/map_test',
    children: [
      {
        index: true, Component: MapTest,
      },     
    ]
  } ,
  
])


createRoot(document.getElementById('root')!).render(
    <RouterProvider router={browserRouter}/>
)
