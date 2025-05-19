import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GraviolaProvider } from './provider/GraviolaProvider'
import './index.css'
import App from './App.tsx'
import { schema } from './schema.ts'
import { allRenderers } from './provider/config.ts'

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GraviolaProvider 
          apiBaseUrl="http://localhost:3000/api/datastore" 
          schema={schema as any} 
          renderers={allRenderers}
          baseIRI={"https://ausleihe.freie-theater-sachsen.de/"}
          entityBaseIRI={"https://entities.freie-theater-sachsen.de/"}
          primaryFields={{
            "Category": {
              "label": "name",
              "description": "description"
            },
            "Item": {
              "label": "name",
              "description": "description",
              "image": "photos"
            }
          }}
          typeNameLabelMap={{
            Category: "Kategorie",
            Item: "Artikel",
          }}
          typeNameUiSchemaOptionsMap={{
            Category: {
              dropdown: true,
            },
          }}
  
        >
          <App />
        </GraviolaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
