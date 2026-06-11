import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import store from "./store/store.ts";

import ReactGA from 'react-ga4'

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID

if (GA_TRACKING_ID) {
  ReactGA.initialize(GA_TRACKING_ID)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={ store }>
      <App/>
    </Provider>
  </StrictMode>,
)
