import { auth } from '@shared/api/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import Image from 'next/image'
import { Role } from '@shared/prisma/generated/enums'

export async function ProfileCard() {
  const session = await auth()

  if (!session?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>No user session found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { user } = session

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          {user.image && (
            <div className="ring-border relative h-20 w-20 overflow-hidden rounded-full ring-2">
              <Image
                src={user.image}
                alt={user.name || 'User avatar'}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">
                {user.name || 'Unknown User'}
              </CardTitle>
              <Badge
                variant={user.role === Role.ADMIN ? 'destructive' : 'default'}
              >
                {user.role}
              </Badge>
            </div>
            <CardDescription className="mt-1">
              {user.email || 'No email provided'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoItem label="User ID" value={user.id} />
          <InfoItem label="Email" value={user.email || 'Not set'} />
          <InfoItem label="Name" value={user.name || 'Not set'} />
          <InfoItem
            label="Role"
            value={
              <Badge
                variant={user.role === Role.ADMIN ? 'destructive' : 'secondary'}
              >
                {user.role}
              </Badge>
            }
          />
          <InfoItem
            label="Profile Image"
            value={user.image ? 'Set' : 'Not set'}
          />
        </div>

        {user.email && (
          <div className="border-t pt-4">
            <h3 className="mb-2 text-sm font-semibold">Email Status</h3>
            <Badge variant="outline" className="text-xs">
              {user.email.includes('@github') ? 'GitHub' : 'Credentials'}
            </Badge>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="mb-3 text-sm font-semibold">Session Details</h3>
          <div className="bg-muted rounded-lg p-4">
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(
                {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  image: user.image ? '***SET***' : null,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="text-sm font-medium">
        {typeof value === 'string' ? (
          <span className="break-all">{value}</span>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}
