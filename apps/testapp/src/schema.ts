export const schema = {
  type: 'object',
  definitions: {
    "Category": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "basePrice": {
          "type": "number",
          "multipleOf": 0.01
        }
      },
      "required": ["name"]
    },
    Item: {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "photos": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "uri"
          }
        },
        "condition": {
          "type": "string"
        },
        "category": {
          "$ref": "#/definitions/Category"
        },
        "basePrice": {
          "type": "number",
          "multipleOf": 0.01
        },
        "isAvailable": {
          "type": "boolean",
          "default": true
        }
      },
    },
    Profession: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        title: {
          type: 'string',
          title: 'Job Title'
        },
        field: {
          type: 'string',
          title: 'Field',
          enum: ['Technology', 'Healthcare', 'Education', 'Finance', 'Other']
        },
        description: {
          type: 'string'
        },
        yearsExperience: {
          type: 'integer',
          minimum: 0,
          title: 'Years of Experience'
        }
      },
      required: ['title', 'field']
    },
    Person: {
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
        },
        hasItem: {
          "$ref": "#/definitions/Item"
        },
        hasItems: {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
              },
            }
          }
        }
      },
      required: ['name', 'email']
    }
  }
}