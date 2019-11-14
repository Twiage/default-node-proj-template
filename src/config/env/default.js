'use strict';

const moment = require('moment');

module.exports = {
  app: {
    title: 'default-node-proj-template',
    description: 'Micro services for default-node-proj-template',
    keywords: 'App, World',
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  db: {
    uri: process.env.MONGO_URL,
    options: {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASSWORD,
    },
    debug: process.env.MONGODB_DEBUG || false,
  },
  tokenLife: {
    user: moment.duration(72, 'hours').asMilliseconds(),
    admin: moment.duration(72, 'hours').asMilliseconds(),
    bigBoard: moment.duration(30, 'days').asMilliseconds(),
  },
  storageSecret: process.env.STORAGE_SECRET || 'TWIAGE',
  storageCollection: 'fs',
  statsd: {
    mock: true,
  },
  baseUrl: 'http://localhost:3000',
  sso: {
    okta: {
      entryPoint: process.env.SAML_ENTRY_POINT || 'https://dev-259877.oktapreview.com/app/twiagedev259877_twiagestaging_1/exkd85m4ipEDw6ceL0h7/sso/saml',
      cert: process.env.SAML_CERTIFICATE || 'MIIDpDCCAoygAwIBAgIGAWA3d5SRMA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEzARBgNVBAMMCmRldi0yNTk4NzcxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTcxMjA4MTg1MDExWhcNMjcxMjA4MTg1MTExWjCBkjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRMwEQYDVQQDDApkZXYtMjU5ODc3MRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmG8WRT0ge7YzvuSG3pTiIshoKNNjPEz7MUP/5JJhSWQQsYi0gLAqYkK1tWAvEgylJ/JAIHQQTm6p9WFLbBzR83CG88DU8uCsRx8qJuqhP7R3i7SZvjGO4RPnQensdh/1Q/VBaBBcLthspLhmNn244kPK60/ZRJgK+io8GnnCRSe1d3BSi8h7Y1TJbWQcS012uClHgkVqI3KjzZDPx3f6J/1QELpkvjAKHkoAh/tEwbuKKBQFWnrbIgz5wkAdBG2ZRI0BMqoAbJVEIhJKnUgKFlOo8vb30GHmQSFOJWYdBsti15aKjGW4pauisKgQ1faYCF4cksGGQSXuuvmnvGPGLQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCCbFPJVuuqX5DUu+9eNTN+4EFQ4Z6zU+mS6dJSO7Qzz8gQUEvqUNqVdEc8CMzCmsHVW0puYSuxQ65838TrzWIJgWlEgN7ZuVNUWSJaSrTJoBGRv6Ji8n7E4UumvmmEIENJIYzjaBhHdrmdbvew/NEQ9XuEUUxtrqM7GufVg6uunIX53mUTtZLagyFs1NsLGN1DyfndrRf4WLzbesuiKEKe71qRj2QjBs/vfwLMJ2RdV0mgZPBA1GdnBWXUW5DSy535rWe4tpRUmAqFbvKB6/h3KsGvqdcbdo4/FFmNlXtSOvuCr/cZ51nhwNhllfC4kmg9G6PJBW27ketPhEUJOnXR',
    },
    adventist: {
      entryPoint: 'https://login.ahss.org/Twiage',
      cert: 'MIIFgzCCBGugAwIBAgIKEeg4AgAAAAAGSzANBgkqhkiG9w0BAQUFADCBxzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExHzAdBgNVBAoTFlNlY3VyZUF1dGggQ29ycG9yYXRpb24xOzA5BgNVBAsTMihjKSAyMDEyIFNlY3VyZUF1dGggQ29ycCAtIEZvciBhdXRob3JpemVkIHVzZSBvbmx5MR0wGwYDVQQLExRDZXJ0aWZpY2F0ZSBTZXJ2aWNlczEmMCQGA1UEAxMdU2VjdXJlQXV0aCBJbnRlcm1lZGlhdGUgQ0EgMUEwHhcNMTQwMTAyMTkzNjE2WhcNMjQwMTAyMTkzNjE2WjCBvTELMAkGA1UEBhMCVVMxEDAOBgNVBAgTB0Zsb3JpZGExFDASBgNVBAcTC1dpbnRlciBQYXJrMT8wPQYDVQQKEzZBZHZlbnRpc3QgSGVhbHRoIFN5c3RlbSBTdW5iZWx0IEhlYWx0aGNhcmUgQ29ycG9yYXRpb24xHTAbBgNVBAsTFEVudGVycHJpc2UgQXJjaGl0ZWN0MSYwJAYDVQQDEx1TZWN1cmVBdXRoMDFhVk0uYWR2ZW50aXN0LmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJMRkFkG6t03JOP4z8XMzbdPXx+FiAtsPHHQcbf09E/Nz0EvTBCAZMc9IBt9Lm0YCPVeheFBFU2DO7ZPdKQMojiYYY0VDWXUF7lIsHp1ifLzpMuSox5oNLonttRabQXY/E3RX6BSbwU0jA/7IlE+cZ7JNvS5s45JYBMkY4wwocs8rtOQ8wcmOYWTwEj19HuEGXKkFLnc9RtigVaUP9cxYMQm0vuiRJQrsYYkkcX8eaAYVq2ymi3aHm/QvcbfEVoojmyQ0j8lpEHtRy+YxuURgOsbLa3ODk03stC71H1Q0EzOSZI8CEjfNsOwuWNImf06TC1paa7RNlGB+94fnyz9WDECAwEAAaOCAXcwggFzMA4GA1UdDwEB/wQEAwIE8DAgBgNVHSUBAf8EFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwHQYDVR0OBBYEFDZDoIyJhnTMWsjUm39fzelqXgMdMB8GA1UdIwQYMBaAFMYEnZjwynY3zNFl1fyz+3UsuRYNMGMGA1UdHwRcMFowWKBWoFSGUmh0dHA6Ly94NTA5Lm11bHRpZmFjdG9ydHJ1c3QzLmNvbS9DZXJ0SW5mby9TZWN1cmVBdXRoJTIwSW50ZXJtZWRpYXRlJTIwQ0ElMjAxQS5jcmwwgZkGCCsGAQUFBwEBBIGMMIGJMIGGBggrBgEFBQcwAoZ6aHR0cDovL3g1MDkubXVsdGlmYWN0b3J0cnVzdDMuY29tL0NlcnRJbmZvL1NBSW50Q0EtMUEuYmFubmVyLm11bHRpZmFjdG9ydHJ1c3QzLmNvbV9TZWN1cmVBdXRoJTIwSW50ZXJtZWRpYXRlJTIwQ0ElMjAxQS5jcnQwDQYJKoZIhvcNAQEFBQADggEBAFlcQC/j3lnvJ1byNNexU1BSSXwRu+0j7jvWaynG0mfJJkWITAFNZZEOnxggMyUhygLphTC0H1M4CoZO5PPAV5iZcD6oYnJKAL8i02uwLQrbYrxdPJx3MUgOGaWdwEUUoOKdvPqjHXyb7JjSAjfl//ayqG05e6BWd5oLasCpi+5sP+X5SNfLuut8K7B0t9qx36K1FU0XzQPOI7klP2QRNbzhldSy2wpq5vASSKZ8Xh9viLnMtZK6JtsEq6M2CMBDIGLKo6Isszz7U/KObJF583LnqqU53f+rPcoz6ZtexQ50hMSU/0lLqbBjLIqwI4CvJW5kD1HbN5zbDfaHezMXPn0=',
    },
  },
  jwt: {
    publicKey: process.env.JWT_PUBLIC_KEY ? process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n') : 'some-key',
    privateKey: process.env.JWT_PRIVATE_KEY,
  },
  aws: {
    alerterSoundReader: {
      accessKeyId: process.env.AWS_ALERTER_SOUND_FILE_READER_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ALERTER_SOUND_FILE_READER_SECRET_ACCESS_KEY,
    },
  },
  access_logs: {
    authorization_token: process.env.ACCESS_LOGS_AUTHORIZATION_TOKEN,
  },
};
