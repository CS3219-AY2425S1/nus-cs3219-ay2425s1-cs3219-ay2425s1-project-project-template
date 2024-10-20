'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyToken } from '@/lib/api-user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader} from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      try {
        const res = await verifyToken(token)
        setUserData({ username: res.data.username, email: res.data.email })
        setLoading(false)
      } catch (error) {
        console.error('Token verification failed:', error)
        router.push('/login')
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin" />
      </div>
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log('Saving user details:', userData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto mt-8 p-4">
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarFallback className='text-4xl'>{userData.username[0].toUpperCase()}</AvatarFallback>
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
                      value={userData.username}
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
                    value={userData.email}
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
