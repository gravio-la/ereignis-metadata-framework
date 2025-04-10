import { useState } from 'react'
import { JsonForms } from '@jsonforms/react'
import { materialCells } from '@jsonforms/material-renderers'
import { Container, Typography, Paper, Box } from '@mui/material'
import './App.css'
import { bringDefinitionToTop } from "@graviola/json-schema-utils";
import { schema } from './schema'
import { allRenderers, BASE_IRI } from './provider/config';
import { uiSchemata } from './provider/schemaHelper'
import { SemanticJsonForm } from '@graviola/semantic-json-form'
import { useAdbContext, useExtendedSchema, useFormDataStore } from '@graviola/edb-state-hooks'

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
      scope: '#/properties/hasItem',
      title: 'has Item',
      options: {
        inline: true,
        context: {
          '$ref': '#/definitions/Item',
          'typeIRI': `${BASE_IRI}Item`,
          mapData: (data: any) => ({ id: data }),
          getID: (data: any) => data?.id
        }
      }
    },
    {
      type: 'Control',
      scope: '#/properties/hasItems',
      title: 'has Items',
      options: {
        context: {
          '$ref': '#/definitions/Item',
          'typeIRI': `${BASE_IRI}Item`,
          mapData: (data: any) => ({ id: data["@id"] }),
          getID: (data: any) => data?.id
        }
      }
    }
  ]
}

// Initial data
const initialData = {
  name: '',
  email: '',
  age: 18,
  comment: '',
}


const personSchema = bringDefinitionToTop(schema as any, 'Person')

function App() {
  const [data, setData] = useState(initialData)

  const handleFormChange = ({ data, errors }: any) => {
    setData(data)
    console.log('Data:', data)
    console.log('Validation errors:', errors)
  }

  const {
    jsonLDConfig: { defaultPrefix, jsonldContext },
  } = useAdbContext();
  //const { formData: data, setFormData: setData } = useFormData();
  const { formData: formData2, setFormData: setFormData2 } = useFormDataStore({
    entityIRI: 'https://ausleihe.freie-theater-sachsen.de/Item/1',
    typeIRI: `${BASE_IRI}Item`,
  });

  const extendedSchema = useExtendedSchema({ typeName: 'Item'})

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        JSONForms with Linked Data Example
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <JsonForms
          schema={personSchema as any}
          data={data}
          uischema={uischema}
          uischemas={uiSchemata.registry}
          renderers={allRenderers}
          cells={materialCells}
          onChange={handleFormChange}
        />
      </Paper>

      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6">Form Data:</Typography>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>


      <SemanticJsonForm
        wrapWithinCard
        typeIRI={`${BASE_IRI}Item`}
        entityIRI={formData2?.['@id']}
        data={formData2}
        forceEditMode
        onChange={setFormData2}
        schema={extendedSchema}
        defaultPrefix={defaultPrefix}
        jsonldContext={jsonldContext as any}
      />

    </Container>
  )
}

export default App
