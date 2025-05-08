---
to: packages/form-renderer/<%= name.split("/")[1] %>/src/<%= h.changeCase.pascal(name.split("/")[1]) %>.stories.tsx
---
<%
  const packageName = name.split("/")[1];
  const ComponentName = h.changeCase.pascal(packageName);
%>
import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/material-renderers';
import { <%= ComponentName %>, <%= ComponentName %>Tester } from './<%= ComponentName %>';

const meta: Meta<typeof <%= ComponentName %>> = {
  component: <%= ComponentName %>,
  title: 'Components/renderer/<%= ComponentName %>',
};

const schema = {
  type: 'object',
  properties: {
    testProperty: { type: 'string' },
  },
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/testProperty' },
  ],
};

const renderers = [
  ...materialRenderers,
  {
    renderer: <%= ComponentName %>,
    tester: <%= ComponentName %>Tester,
  },
];

const JsonFormsFor<%= ComponentName %> = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const handleChange = ({data, error}: {data: any, error: any}) => {
    setData(data);
    setError(error);
  };
  return (
    <>
      <JsonForms
        schema={schema}
        uischema={uischema}
        renderers={renderers}
        data={data}
        onChange={handleChange}
      />
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </>
  )
}

export default meta;
type Story = StoryObj<typeof <%= ComponentName %>>;

export const Default: Story = {
  render: () => <JsonFormsFor<%= ComponentName %> />,
};
