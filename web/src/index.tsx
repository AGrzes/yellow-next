import React from 'react'

import { createRoot } from 'react-dom/client'
import 'reflect-metadata'
import { App } from './app'
import './main.scss'

const appElement = document.getElementById('root')
createRoot(appElement).render(<App />)
