import { Container, Typography } from '@mui/material'
import './App.css'
import { GenericForm } from '@graviola/semantic-json-form'

function App() {

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        JSONForms with Linked Data Example
      </Typography>


      <GenericForm typeName="Item" />

    </Container>
  )
}

export default App
