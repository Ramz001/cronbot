import { type IntegrationToken } from '@prisma/generated/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/card'
import { Badge } from '@shared/ui/badge'
import { Calendar, Bot, KeyRound, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface IntegrationCardProps {
  token: Omit<IntegrationToken, 'token'>
}

export function IntegrationCard({ token }: IntegrationCardProps) {
  const isExpired = token.expiresAt
    ? new Date(token.expiresAt) < new Date()
    : false

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary rounded-md p-2">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {token.title || 'Discord Bot'}
              </CardTitle>
              <CardDescription className="font-medium capitalize">
                {token.provider} Integration
              </CardDescription>
            </div>
          </div>
          <Badge variant={isExpired ? 'destructive' : 'default'}>
            {isExpired ? 'Expired' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-md p-2">
            <KeyRound className="h-4 w-4" />
            <span className="font-mono">{token.tokenPreview}••••••••</span>
          </div>

          <div className="text-muted-foreground mt-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Added{' '}
              {formatDistanceToNow(new Date(token.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {token.expiresAt && !isExpired && (
            <div className="text-muted-foreground flex items-center gap-2 dark:text-orange-400">
              <Clock className="h-4 w-4" />
              <span>
                Expires{' '}
                {formatDistanceToNow(new Date(token.expiresAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
