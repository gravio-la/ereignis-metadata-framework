import {
  Button,
  ButtonGroup,
  Container,
  FormGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "./App.css";
import { GenericForm } from "@graviola/semantic-json-form";
import { useState } from "react";

function App() {
  const [itemUrl, setItemUrl] = useState<string | undefined>(
    "https://www.example.org/Item/1yjpjqkptbn",
  );
  const [inputURL, setInputURL] = useState<string>(
    "http://www.example.org/Item/1yjpjqkptbn",
  );
  const [formData, setFormData] = useState<any>(undefined);

  const [hideForm, setHideForm] = useState(false);
  const handleHideAndShow = () => {
    setHideForm(!hideForm);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Generic Form with Linked Data Example
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom align="center">
        {itemUrl}
      </Typography>

      <Paper sx={{ mb: 2, p: 4, textAlign: "left" }}>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "cloumn",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Item URL"
            value={inputURL}
            onChange={(e) => setInputURL(e.target.value)}
          />
          <ButtonGroup variant="contained">
            <Button onClick={() => setItemUrl(inputURL)}>Load Item</Button>
            <Button onClick={() => setItemUrl(undefined)}>New Item</Button>
            <Button onClick={handleHideAndShow}>
              {hideForm ? "Show" : "Hide"} Form
            </Button>
          </ButtonGroup>
        </FormGroup>
      </Paper>

      {!hideForm ? (
        <GenericForm
          entityIRI={itemUrl}
          typeName="Item"
          onFormDataChange={setFormData}
        />
      ) : (
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Form is hidden
        </Typography>
      )}

      <Paper sx={{ mt: 4, p: 2, textAlign: "left" }}>
        <code>
          <pre>{formData && JSON.stringify(formData, null, 2)}</pre>
        </code>
      </Paper>
    </Container>
  );
}

export default App;
