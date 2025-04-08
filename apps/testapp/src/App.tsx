import { useState } from 'react'
import { JsonForms } from '@jsonforms/react'
import { materialRenderers, materialCells } from '@jsonforms/material-renderers'
import { Container, Typography, Paper, Box } from '@mui/material'
import './App.css'

// Sample JSON Schema
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3
    },
    email: {
      type: 'string',
      format: 'email'
    },
    age: {
      type: 'integer',
      minimum: 0
    },
    comment: {
      type: 'string'
    }
  },
  required: ['name', 'email']
}

// UI Schema for custom layout
const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      scope: '#/properties/email'
    },
    {
      type: 'Control',
      scope: '#/properties/age'
    },
    {
      type: 'Control',
      scope: '#/properties/comment',
      options: {
        multi: true
      }
    }
  ]
}

// Initial data
const initialData = {
  name: '',
  email: '',
  age: 18,
  comment: ''
}

function App() {
  const [data, setData] = useState(initialData)

  const handleFormChange = ({ data, errors }: any) => {
    setData(data)
    console.log('Data:', data)
    console.log('Validation errors:', errors)
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        JSONForms with Material UI Example
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={handleFormChange}
        />
      </Paper>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6">Form Data:</Typography>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
    </Container>
  )
}

export default App
