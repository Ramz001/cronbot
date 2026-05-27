'use client'

import React, { useState } from 'react'
import {
  Play,
  Save,
  MessageSquare,
  Mail,
  Globe,
  Database,
  Hourglass,
  ArrowDown,
  Trash2,
  Plus,
  Workflow
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'

const ACTIONS = [
  { id: 'slack', label: 'Send Slack Message', icon: MessageSquare, color: 'text-slate-400' },
  { id: 'email', label: 'Send Email', icon: Mail, color: 'text-blue-500' },
  { id: 'http', label: 'HTTP Request', icon: Globe, color: 'text-cyan-500' },
  { id: 'discord', label: 'Discord Webhook', icon: MessageSquare, color: 'text-indigo-500' },
  { id: 'database', label: 'Database Query', icon: Database, color: 'text-emerald-500' },
  { id: 'delay', label: 'Delay', icon: Hourglass, color: 'text-yellow-500' }
]

const BuilderPage = () => {
  // Mock state for workflow steps
  const [action, setAction] = useState<string | null>('discord')

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Workflow Builder</h1>
          <p className="text-sm text-muted-foreground">Define what happens when this workflow runs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Play className="size-4" />
            Test Workflow
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="size-4" />
            Save Workflow
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 border-r border-border/50 bg-background/50 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Actions Section */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Available Actions
                </h2>
                <div className="space-y-1">
                  {ACTIONS.map((a) => {
                    const Icon = a.icon
                    const isActive = action === a.id
                    return (
                      <button
                        key={a.id}
                        onClick={() => setAction(a.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${
                          isActive ? 'bg-muted/80 font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        <div className="flex size-7 items-center justify-center rounded-md bg-background border border-border/50 shadow-sm">
                          <Icon className={`size-4 ${a.color}`} />
                        </div>
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-muted/10 relative overflow-y-auto p-8">
          <div className="mx-auto max-w-2xl flex flex-col items-center pb-20">
            
            {/* Entry Node */}
            <div className="flex items-center gap-3 rounded-full border border-border/50 bg-background px-6 py-3 shadow-sm">
              <Workflow className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Workflow Execution Starts</span>
            </div>

            <div className="py-4">
              <ArrowDown className="size-5 text-muted-foreground" />
            </div>

            {/* Action Node */}
            {action === 'discord' ? (
              <Card className="w-full max-w-md shadow-sm border-border/50">
                <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-500">
                      <MessageSquare className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Discord Action</h3>
                      <p className="text-xs text-muted-foreground">Send a message to a channel</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Select Guild (Server)</Label>
                    <Select defaultValue="server1">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select server" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="server1">Cronbot Support Hub</SelectItem>
                        <SelectItem value="server2">Dev Test Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Select Channel</Label>
                    <Select defaultValue="general">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">#general</SelectItem>
                        <SelectItem value="announcements">#announcements</SelectItem>
                        <SelectItem value="logs">#logs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Message Content</Label>
                    <Textarea 
                      className="min-h-25 resize-none" 
                      placeholder="Type your message here..."
                      defaultValue="Hello from Cronbot Workflow! 🚀"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Markdown is supported in future updates.</p>
                  </div>
                </div>
              </Card>
            ) : action ? (
               <Card className="w-full max-w-md shadow-sm border-dashed border-2 bg-transparent flex flex-col items-center justify-center p-8 gap-3">
                  <div className="rounded-full bg-muted p-4">
                     <Plus className="size-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Action Selected</h3>
                  <p className="text-sm text-muted-foreground">Configure the selected action details</p>
               </Card>
            ) : (
                <Card className="w-full max-w-md shadow-sm border-dashed border-2 bg-transparent flex flex-col items-center justify-center p-8 gap-3">
                  <div className="rounded-full bg-muted p-4">
                     <Plus className="size-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Add an Action</h3>
                  <p className="text-sm text-muted-foreground">Select an action to continue the workflow</p>
               </Card>
            )}

            {action && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="border-dashed gap-2 text-muted-foreground">
                  <Plus className="size-4" />
                  Add next step
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderPage
