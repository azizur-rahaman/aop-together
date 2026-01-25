"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Combobox } from "@/components/ui/ComoBox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea" // Added Textarea import
import { Subject } from "./SubjectList"
import { createRoom } from "../services/subjects.service"

interface CreateGroupModalProps {
  subjects: Subject[]
  isOpen?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: {
    name: string
    description: string // Added description to onSubmit data type
    subject: string
    maxParticipants: number
    isPublic: boolean
  }) => void
  isLoading?: boolean
}

export function CreateGroupModal({
  subjects,
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateGroupModalProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("") // Added description state
  const [subject, setSubject] = React.useState("")
  const [maxParticipants, setMaxParticipants] = React.useState(5)
  const [isPublic, setIsPublic] = React.useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit?.({
      name,
      description,
      subject,
      maxParticipants,
      isPublic,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Create Study Room</DialogTitle>
            <DialogDescription>
              Study Together · Watch Together · Solve Together
            </DialogDescription>
          </DialogHeader>

          {/* Room Name */}
          <div className="grid gap-2">
            <Label>Room Name</Label>
            <Input
              placeholder="Final Exam Prep"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              placeholder="What are we studying?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Subject */}
          <div className="grid gap-2">
            <Label>Subject</Label>
            <Combobox
              subjects={subjects}
              value={subject}
              onChange={setSubject}
            />
          </div>

          {/* Max Participants */}
          <div className="grid gap-2">
            <Label>Max Participants</Label>
            <Input
              type="number"
              min={2}
              max={50}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
            />
          </div>

          {/* Public / Private */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <Label>Public Room</Label>
              <p className="text-sm text-muted-foreground">
                Anyone can discover and join
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
