import { useAdbContext, useExtendedSchema, useFormDataStore } from '@graviola/edb-state-hooks'
import { SemanticJsonForm } from './SemanticJsonForm'
import { useMemo } from 'react';


type Props = {
  entityIRI?: string
  typeName: string,
}

export function GenericForm({ entityIRI, typeName }: Props) {

  const {
    typeNameToTypeIRI,
    createEntityIRI,
    jsonLDConfig: { defaultPrefix, jsonldContext },
  } = useAdbContext();
  const initialEntityIRI = useMemo(() => entityIRI || createEntityIRI(typeName), [typeName, entityIRI])
  const typeIRI = typeNameToTypeIRI(typeName)
  const { formData, setFormData } = useFormDataStore({
    entityIRI: initialEntityIRI,
    typeIRI,
  });

  const extendedSchema = useExtendedSchema({ typeName })

  return (
      <SemanticJsonForm
        wrapWithinCard
        entityIRI={formData?.['@id']}
        typeIRI={typeIRI}
        data={formData}
        forceEditMode
        onChange={setFormData}
        schema={extendedSchema}
        defaultPrefix={defaultPrefix}
        jsonldContext={jsonldContext as any}
      />
  )
}

