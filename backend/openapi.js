export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Apex Himalaya Treks API',
    version: '1.0.0',
    description: 'Booking and admin API for the Apex Himalaya Treks website.',
  },
  servers: [{ url: 'http://localhost:3001', description: 'Local development server' }],
  tags: [
    { name: 'Health' },
    { name: 'Authentication' },
    { name: 'Bookings' },
    { name: 'Packages' },
    { name: 'Newsletter' },
    { name: 'Admin' },
  ],
  paths: {
    '/api/customer/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Create a customer account (passwords require 12-128 characters)',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 12, maxLength: 128 } } } } } },
        responses: { 201: { description: 'Account created; verify the email before sign-in' }, 409: { description: 'Email is already registered' } },
      },
    },
    '/api/customer/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Sign in to a customer account',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } } } } } },
        responses: { 200: { description: 'Verified customer received a bearer token' }, 401: { description: 'Email or password is incorrect' }, 403: { description: 'Email verification is required' } },
      },
    },
    '/api/customer/verify-email': {
      post: {
        tags: ['Authentication'], summary: 'Verify email and link matching guest bookings',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['token'], properties: { token: { type: 'string' } } } } } },
        responses: { 200: { description: 'Email verified and customer session created' }, 400: { description: 'Verification link is invalid or expired' } },
      },
    },
    '/api/customer/resend-verification': {
      post: { tags: ['Authentication'], summary: 'Resend email verification instructions', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } }, responses: { 200: { description: 'Generic response to prevent account enumeration' } } },
    },
    '/api/customer/password-reset/request': {
      post: { tags: ['Authentication'], summary: 'Request a password reset email', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } }, responses: { 200: { description: 'Generic response to prevent account enumeration' } } },
    },
    '/api/customer/password-reset/complete': {
      post: { tags: ['Authentication'], summary: 'Complete password reset using a one-time token', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['token', 'password'], properties: { token: { type: 'string' }, password: { type: 'string', minLength: 12, maxLength: 128 } } } } } }, responses: { 200: { description: 'Password changed and existing sessions invalidated' }, 400: { description: 'Reset link invalid or expired' } } },
    },
    '/api/customer/me': {
      get: { tags: ['Authentication'], summary: 'Get the signed-in customer profile', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Customer profile' }, 401: { description: 'Customer sign-in required' } } },
    },
    '/api/customer/profile': {
      patch: { tags: ['Authentication'], summary: 'Update customer name and phone', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string', minLength: 2, maxLength: 120 }, phone: { type: 'string', maxLength: 40 } } } } } }, responses: { 200: { description: 'Updated profile' }, 401: { description: 'Customer sign-in required' } } },
    },
    '/api/customer/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List bookings made while signed in as the customer',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Customer bookings, newest first' }, 401: { description: 'Customer sign-in required' } },
      },
    },
    '/api/customer/bookings/{id}/preparation': {
      patch: { tags: ['Bookings'], summary: 'Save one trip preparation checklist item', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['taskId', 'completed'], properties: { taskId: { type: 'string' }, completed: { type: 'boolean' } } } } } }, responses: { 200: { description: 'Updated checklist items' }, 404: { description: 'Booking not found for this customer' } } },
    },
    '/api/admin/newsletter': {
      get: {
        tags: ['Admin'],
        summary: 'Search and page through newsletter subscribers',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Subscriber page' }, 401: { description: 'Admin sign-in required' } },
      },
    },
    '/api/admin/newsletter/{id}': {
      delete: {
        tags: ['Admin'],
        summary: 'Remove a newsletter subscriber (unsubscribe)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Subscriber removed' }, 404: { description: 'Subscriber not found' } },
      },
    },
    '/api/admin/readiness': {
      get: {
        tags: ['Admin'],
        summary: 'Get integration readiness and booking/subscriber totals',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Configuration readiness without secret values' }, 401: { description: 'Admin sign-in required' } },
      },
    },
    '/api/newsletter/subscribe': {
      post: {
        tags: ['Newsletter'],
        summary: 'Subscribe an email address to trek updates',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email', maxLength: 320 } } } } },
        },
        responses: { 200: { description: 'Subscription saved (safe to repeat)' }, 400: { description: 'Email address is invalid' } },
      },
    },
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Check whether the API is running',
        responses: {
          200: {
            description: 'API is available',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } },
              },
            },
          },
        },
      },
    },
    '/api/packages': {
      get: {
        tags: ['Packages'],
        summary: 'List active trek packages for the website',
        responses: { 200: { description: 'Active packages in customer-facing order' } },
      },
    },
    '/api/packages/{slug}': {
      get: {
        tags: ['Packages'],
        summary: 'Get one active trek package by its URL slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Active trek package' }, 404: { description: 'Package was not found or is inactive' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Sign in as an admin',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email', example: 'admin@example.com' }, password: { type: 'string', format: 'password', example: 'your-admin-password' } } } } },
        },
        responses: {
          200: { description: 'Admin signed in and received a bearer token' },
          400: { description: 'Email or password is missing' },
          401: { description: 'Credentials are incorrect' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get the signed-in admin',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Admin session is valid' }, 401: { description: 'Sign-in required or session expired' } },
      },
    },
    '/api/admin/settings': {
      get: {
        tags: ['Admin'],
        summary: 'Get the signed-in admin profile and notification preferences',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Admin settings' }, 401: { description: 'Sign-in required or expired' } },
      },
    },
    '/api/admin/settings/profile': {
      patch: {
        tags: ['Admin'],
        summary: 'Update admin profile and notification preferences',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'notifications'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 120 },
                  email: { type: 'string', format: 'email' },
                  notifications: {
                    type: 'object',
                    required: ['newBooking', 'cancellation', 'paymentReceived', 'weeklyReport'],
                    properties: {
                      newBooking: { type: 'boolean' },
                      cancellation: { type: 'boolean' },
                      paymentReceived: { type: 'boolean' },
                      weeklyReport: { type: 'boolean' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Settings saved' }, 400: { description: 'Invalid profile data' }, 409: { description: 'Email is already in use' } },
      },
    },
    '/api/admin/settings/password': {
      patch: {
        tags: ['Admin'],
        summary: 'Change the admin password after verifying the current password',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['current_password', 'new_password'], properties: { current_password: { type: 'string', format: 'password' }, new_password: { type: 'string', format: 'password', minLength: 12, maxLength: 128 } } } } } },
        responses: { 200: { description: 'Password changed' }, 400: { description: 'New password does not meet requirements' }, 401: { description: 'Current password is incorrect' } },
      },
    },
    '/api/bookings': {
      post: {
        tags: ['Bookings'],
        summary: 'Submit a trek booking request',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['trek_name', 'start_date', 'travelers', 'customer_name', 'customer_email', 'customer_phone'],
                properties: {
                  trek_name: { type: 'string', example: 'Everest Base Camp Trek' },
                  start_date: { type: 'string', format: 'date', example: '2027-04-15' },
                  travelers: { type: 'integer', minimum: 1, maximum: 20, example: 2 },
                  addons: { type: 'array', items: { type: 'string' }, example: ['porter', 'gear'] },
                  customer_name: { type: 'string', example: 'Alex Trekker' },
                  customer_email: { type: 'string', format: 'email', example: 'alex@example.com' },
                  customer_phone: { type: 'string', example: '+977 9800000000' },
                  message: { type: 'string', example: 'Vegetarian meals requested.' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Booking request saved' }, 400: { description: 'Booking details are invalid' } },
      },
    },
    '/api/bookings/track': {
      post: {
        tags: ['Bookings'],
        summary: 'Look up a booking using its reference and booking email',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['booking_reference', 'customer_email'], properties: { booking_reference: { type: 'string', example: 'A1B2C3D4E5F6071829' }, customer_email: { type: 'string', format: 'email', example: 'alex@example.com' } } } } },
        },
        responses: { 200: { description: 'Booking status and payment summary' }, 400: { description: 'Reference or email is invalid' }, 404: { description: 'Booking was not found' } },
      },
    },
    '/api/payments/esewa/checkout/{token}': {
      get: {
        tags: ['Bookings'],
        summary: 'Start an emailed eSewa payment link',
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' }, description: 'Single-use secret from the booking email' }],
        responses: { 200: { description: 'Returns an auto-submitting eSewa checkout form' }, 404: { description: 'Payment link is invalid or expired' }, 503: { description: 'eSewa is not configured' } },
      },
    },
    '/api/payments/esewa/success': {
      get: {
        tags: ['Bookings'],
        summary: 'Receive and verify eSewa payment callback',
        parameters: [{ name: 'data', in: 'query', required: true, schema: { type: 'string' }, description: 'Base64 encoded eSewa response; signature and server-side transaction status are checked' }],
        responses: { 303: { description: 'Redirects to frontend payment result after verification' } },
      },
    },
    '/api/admin/bookings': {
      get: {
        tags: ['Admin'],
        summary: 'List booking requests (admin only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Bookings sorted newest first' }, 401: { description: 'Sign-in required or session expired' } },
      },
    },
    '/api/admin/bookings/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Change a booking status (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MongoDB booking document ID' }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] } } } } } },
        responses: { 200: { description: 'Booking status updated; notification reports email and eSewa link setup results' }, 400: { description: 'Status or ID is invalid' }, 401: { description: 'Sign-in required or session expired' }, 404: { description: 'Booking request was not found' } },
      },
    },
    '/api/admin/bookings/{id}/payment-link': {
      post: {
        tags: ['Admin'],
        summary: 'Email a fresh eSewa payment link for a confirmed booking',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MongoDB booking document ID' }],
        responses: { 200: { description: 'Payment link created; notification reports email delivery' }, 401: { description: 'Sign-in required or session expired' }, 404: { description: 'Booking request was not found' }, 409: { description: 'Booking is not confirmed or is already paid' }, 503: { description: 'eSewa is not configured' } },
      },
    },
    '/api/admin/packages': {
      get: {
        tags: ['Admin'],
        summary: 'List trek packages (admin only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Packages sorted newest first' }, 401: { description: 'Sign-in required or session expired' } },
      },
      post: {
        tags: ['Admin'],
        summary: 'Create a trek package (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TrekPackageInput' } } },
        },
        responses: { 201: { description: 'Package created' }, 400: { description: 'Package details are invalid' }, 401: { description: 'Sign-in required or session expired' }, 409: { description: 'A package with this name already exists' } },
      },
    },
    '/api/admin/packages/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Update a trek package (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MongoDB package document ID' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TrekPackageInput' } } } },
        responses: { 200: { description: 'Package updated' }, 400: { description: 'Package details are invalid' }, 401: { description: 'Sign-in required or session expired' }, 404: { description: 'Package was not found' } },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Delete a trek package (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MongoDB package document ID' }],
        responses: { 204: { description: 'Package deleted' }, 401: { description: 'Sign-in required or session expired' }, 404: { description: 'Package was not found' } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Paste the access_token returned by POST /api/auth/login.' },
    },
    schemas: {
      TrekPackageInput: {
        type: 'object',
        required: ['name', 'region', 'duration', 'difficulty', 'price', 'maxGroupSize'],
        properties: {
          name: { type: 'string', example: 'Everest Base Camp' },
          region: { type: 'string', example: 'Khumbu' },
          duration: { type: 'string', example: '14 Days' },
          difficulty: { type: 'string', enum: ['Easy', 'Moderate', 'Strenuous'] },
          price: { type: 'integer', minimum: 0, example: 185000, description: 'Price in NPR per person' },
          maxGroupSize: { type: 'integer', minimum: 1, maximum: 100, example: 12 },
          status: { type: 'string', enum: ['active', 'inactive'], default: 'active' },
          description: { type: 'string', example: 'A guided trek to Everest Base Camp.' },
          image_url: { type: 'string', format: 'uri', example: 'https://example.com/everest.jpg' },
          max_altitude: { type: 'string', example: '5,364m' },
          featured: { type: 'boolean', default: false },
        },
      },
    },
  },
};
