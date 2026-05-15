import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Section,
  Text,
} from '@react-email/components'

interface OTPEmailProps {
  otp: string
  name?: string
  expiryTime?: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export default function OTPEmail({
  otp = '123456',
  name = 'User',
  expiryTime = '10 minutes',
}: OTPEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>🔐 Auth Verification</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {name},</Text>

            <Text style={mainText}>
              Your one-time password (OTP) for email verification is:
            </Text>

            {/* OTP Code Box */}
            <Section style={otpContainer}>
              <Text style={otpCode}>{otp}</Text>
            </Section>

            <Text style={instructionText}>
              Please enter this code in your browser window to verify your email
              address. This code will expire in {expiryTime}.
            </Text>

            {/* Security Notice */}
            <Section style={securityBox}>
              <Text style={securityTitle}>⚠️ Security Notice</Text>
              <Text style={securityText}>
                • Never share this code with anyone
                <br />
                • We will never ask for your OTP via email or phone
                <br />• This code is valid for {expiryTime} only
                <br />• If you didn&apos;t request this, please ignore this
                email
              </Text>
            </Section>

            <Text style={footerText}>
              If you have any issues, please{' '}
              <Link href={`${baseUrl}/support`} style={link}>
                contact our support team
              </Link>
              .
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerCopy}>© 2026 Auth JS. All rights reserved.</Text>
            <Text style={footerCopy}>
              This email was sent to you because you requested email
              verification.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f3f3f5',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  maxWidth: '600px',
  width: '100%',
  margin: '0 auto',
  marginBottom: '64px',
  marginTop: '32px',
  padding: '20px 0 48px',
}

const header = {
  backgroundColor: '#0f172a',
  padding: '32px 20px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
}

const content = {
  padding: '20px 32px 32px',
}

const greeting = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1a202c',
  margin: '0 0 16px 0',
}

const mainText = {
  fontSize: '15px',
  color: '#475569',
  margin: '0 0 24px 0',
  lineHeight: '1.5',
}

const otpContainer = {
  backgroundColor: '#f8fafc',
  border: '2px dashed #0f172a',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const otpCode = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#0f172a',
  margin: '0',
  letterSpacing: '8px',
  fontFamily: 'monospace',
}

const instructionText = {
  fontSize: '14px',
  color: '#64748b',
  margin: '24px 0',
  lineHeight: '1.6',
  textAlign: 'center' as const,
}

const securityBox = {
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #dc2626',
  padding: '16px 20px',
  borderRadius: '4px',
  margin: '24px 0',
}

const securityTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#991b1b',
  margin: '0 0 8px 0',
}

const securityText = {
  fontSize: '13px',
  color: '#7f1d1d',
  margin: '0',
  lineHeight: '1.8',
}

const footerText = {
  fontSize: '14px',
  color: '#64748b',
  margin: '24px 0',
  lineHeight: '1.6',
}

const link = {
  color: '#0f172a',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '12px 0',
}

const footer = {
  padding: '20px 32px',
  textAlign: 'center' as const,
}

const footerCopy = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '4px 0',
}
