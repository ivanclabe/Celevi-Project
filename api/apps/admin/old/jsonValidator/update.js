'use strict';
exports.updateOne = {
  type: 'object',
  title: 'updateSchema',
  description: 'Esquema para validacion de datos',
  required: ['data'],
  properties: {
    data: {
      title: 'Data',
      description: 'Data Array schema',
      type: 'object',
      required: ['type', 'id', 'attributes'],
      properties: {
        type: { type: 'string', pattern: '^[a-z]+$' },
        id: { type: ['string', 'integer'], pattern: '^[a-z0-9]+$' },
        attributes: { type: 'object' },
        relationships: {
          type: 'object',
          '^([a-z]-?_?)[a-z]+$': { type: 'object' }
        }
      }
    },
    errors: {
      type: 'array',
      maxItems: 5,
      items: {
        title: 'Error',
        description: 'Error Array schema',
        type: 'object',
        required: ['status', 'code', 'message'],
        properties: {
          status: { type: 'integer', pattern: '^[1-9][0-9]*$', minimum: 200 },
          code: { type: ['string', 'integer'], maxLength: 64 },
          message: { type: 'string', pattern: '^[a-z]+$', maxLength: 128 }
        }
      }
    },
    links: { type: 'object' },
    meta: { type: 'object' },
    sources: { type: 'object' }
  }
};

exports.updateMany = {
  type: 'object',
  title: 'updateSchema',
  description: 'Esquema para validacion de datos',
  required: ['data'],
  properties: {
    data: {
      title: 'Data',
      description: 'Data Array schema',
      type: 'object',
      required: ['type', 'attributes'],
      properties: {
        type: { type: 'string', pattern: '^[a-z]+$' },
        id: { type: ['string', 'integer'], pattern: '^[a-z0-9]+$' },
        attributes: { type: 'object' },
        relationships: {
          type: 'object',
          '^([a-z]-?_?)[a-z]+$': { type: 'object' }
        }
      }
    },
    errors: {
      type: 'array',
      maxItems: 5,
      items: {
        title: 'Error',
        description: 'Error Array schema',
        type: 'object',
        required: ['status', 'code', 'message'],
        properties: {
          status: { type: 'integer', pattern: '^[1-9][0-9]*$', minimum: 200 },
          code: { type: ['string', 'integer'], maxLength: 64 },
          message: { type: 'string', pattern: '^[a-z]+$', maxLength: 128 }
        }
      }
    },
    links: { type: 'object' },
    meta: { type: 'object' },
    sources: { type: 'object' }
  }
};
