'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [userDetails, setUserDetails] = useState({
    username: 'JohnDoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    githubId: 'johndoe123'
  })

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically send the updated userDetails to your backend
    console.log('Saving user details:', userDetails)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto mt-8 p-4">
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="@JohnDoe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={userDetails.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleEdit}>Cancel</Button>
                      <Button className="bg-primary text-primary-foreground" onClick={handleSave}>Save</Button>
                    </>
                  ) : (
                    <Button className="bg-primary text-primary-foreground" onClick={handleEdit}>Edit</Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      </div>
  )
}