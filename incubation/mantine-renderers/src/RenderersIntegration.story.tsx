import { JsonForms } from '@jsonforms/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { mantineCells, mantineRenderers } from './index'

const data = {
  profile: {
    firstName: 'Ava',
    lastName: 'Ng',
    title: 'Staff Designer',
    headline: 'Designing calm, data-heavy products',
    bio: 'Focuses on clarity in complex workflows.',
    birthDate: '1990-05-12',
    preferredContactTime: '09:30:00',
    lastUpdated: '2025-02-12T09:30:00Z',
  },
  preferences: {
    role: 'Designer',
    department: 'design',
    contactPreference: 'email',
    newsletterFrequency: 'weekly',
    receiveUpdates: true,
    teamSize: 8,
    budget: 12000,
    satisfaction: 72,
  },
  credentials: {
    password: 'not-a-real-password',
  },
  addresses: [
    {
      label: 'Home',
      street: '12 Oak Street',
      city: 'Portland',
      region: 'OR',
      postalCode: '97209',
      location: { lat: 45.523, lng: -122.676 },
    },
    {
      label: 'Office',
      street: '203 Maple Ave',
      city: 'Seattle',
      region: 'WA',
      postalCode: '98109',
      location: { lat: 47.620, lng: -122.349 },
    },
  ],
  contactMeans: [
    { label: 'Work email', kind: 'email', value: 'ava.ng@example.com', preferred: true },
    { label: 'Mobile', kind: 'phone', value: '+1 555 0100', preferred: false },
    { label: 'Slack', kind: 'slack', value: '@ava', preferred: false },
  ],
}

const schema = {
  type: 'object',
  properties: {
    profile: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        title: { type: 'string' },
        headline: { type: 'string' },
        bio: { type: 'string' },
        birthDate: { type: 'string', format: 'date' },
        preferredContactTime: { type: 'string', format: 'time' },
        lastUpdated: { type: 'string', format: 'date-time' },
      },
    },
    preferences: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['Designer', 'Engineer', 'Manager'] },
        department: {
          type: 'string',
          oneOf: [
            { const: 'design', title: 'Design' },
            { const: 'engineering', title: 'Engineering' },
            { const: 'product', title: 'Product' },
          ],
        },
        contactPreference: { type: 'string', enum: ['email', 'phone', 'sms'] },
        newsletterFrequency: {
          type: 'string',
          oneOf: [
            { const: 'weekly', title: 'Weekly' },
            { const: 'monthly', title: 'Monthly' },
            { const: 'quarterly', title: 'Quarterly' },
          ],
        },
        receiveUpdates: { type: 'boolean' },
        teamSize: { type: 'integer' },
        budget: { type: 'number' },
        satisfaction: { type: 'number', minimum: 0, maximum: 100, default: 60 },
      },
    },
    credentials: {
      type: 'object',
      properties: {
        password: { type: 'string' },
      },
    },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          street: { type: 'string' },
          city: { type: 'string' },
          region: { type: 'string' },
          postalCode: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              lat: { type: 'number' },
              lng: { type: 'number' },
            },
          },
        },
      },
    },
    contactMeans: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          kind: { type: 'string', enum: ['email', 'phone', 'slack'] },
          value: { type: 'string' },
          preferred: { type: 'boolean' },
        },
      },
    },
  },
}

const addressDetailUiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/label', label: 'Label' },
        { type: 'Control', scope: '#/properties/street', label: 'Street' },
        { type: 'Control', scope: '#/properties/city', label: 'City' },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/region', label: 'Region' },
        { type: 'Control', scope: '#/properties/postalCode', label: 'Postal code' },
      ],
    },
    {
      type: 'Group',
      label: 'Coordinates',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/location/properties/lat', label: 'Lat' },
            { type: 'Control', scope: '#/properties/location/properties/lng', label: 'Lng' },
          ],
        },
      ],
    },
  ],
}

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Profile',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/profile/properties/firstName', label: 'First name' },
            { type: 'Control', scope: '#/properties/profile/properties/lastName', label: 'Last name' },
          ],
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/profile/properties/title',
              label: 'Title',
              options: { placeholder: 'Role title' },
            },
            {
              type: 'Control',
              scope: '#/properties/profile/properties/headline',
              label: 'Headline',
              options: { placeholder: 'Short one-liner' },
            },
          ],
        },
        {
          type: 'Control',
          scope: '#/properties/profile/properties/bio',
          label: 'Bio',
          options: { multi: true, placeholder: 'Share a few sentences...' },
        },
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/profile/properties/birthDate', label: 'Birth date' },
            {
              type: 'Control',
              scope: '#/properties/profile/properties/preferredContactTime',
              label: 'Preferred contact time',
            },
          ],
        },
        { type: 'Control', scope: '#/properties/profile/properties/lastUpdated', label: 'Last updated' },
      ],
    },
    {
      type: 'Group',
      label: 'Preferences',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/preferences/properties/role', label: 'Role' },
            { type: 'Control', scope: '#/properties/preferences/properties/department', label: 'Department' },
          ],
        },
        {
          type: 'Control',
          scope: '#/properties/preferences/properties/contactPreference',
          label: 'Preferred contact',
          options: { format: 'radio', orientation: 'horizontal' },
        },
        {
          type: 'Control',
          scope: '#/properties/preferences/properties/newsletterFrequency',
          label: 'Newsletter cadence',
          options: { format: 'radio' },
        },
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/preferences/properties/teamSize', label: 'Team size' },
            { type: 'Control', scope: '#/properties/preferences/properties/budget', label: 'Budget' },
          ],
        },
        {
          type: 'Control',
          scope: '#/properties/preferences/properties/satisfaction',
          label: 'Satisfaction',
          options: { slider: true },
        },
        {
          type: 'Control',
          scope: '#/properties/preferences/properties/receiveUpdates',
          label: 'Receive updates',
        },
      ],
    },
    {
      type: 'Group',
      label: 'Security',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/credentials/properties/password',
          label: 'Password',
          options: { format: 'password' },
        },
      ],
    },
    {
      type: 'Group',
      label: 'Addresses',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/addresses',
          label: 'Address book',
          options: { detail: addressDetailUiSchema, elementLabelProp: 'label' },
        },
      ],
    },
    {
      type: 'Group',
      label: 'Contact means',
      elements: [{ type: 'Control', scope: '#/properties/contactMeans', label: 'Contact means' }],
    },
  ],
}

const meta = {
  title: 'Forms/Renderer Integration',
  component: JsonForms,
} satisfies Meta<typeof JsonForms>

export default meta

type Story = StoryObj<typeof meta>

export const RendererIntegration: Story = {
  args: {
    data,
    schema,
    uischema,
    renderers: mantineRenderers,
    cells: mantineCells,
  },
}
