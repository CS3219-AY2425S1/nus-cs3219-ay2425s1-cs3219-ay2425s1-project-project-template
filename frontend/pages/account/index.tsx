import AccountSettings from '@/components/account/AccountSetting'
import useProtectedRoute from '@/hooks/UseProtectedRoute'

export default function Account() {
    const { loading } = useProtectedRoute()
    if (loading) return null
    return <AccountSettings />
}
