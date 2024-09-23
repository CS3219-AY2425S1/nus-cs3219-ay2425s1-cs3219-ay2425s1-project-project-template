import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Profile from './Profile'
import Setting from './Settings'

const AccountSetting = () => {
    return (
        <>
            <Tabs defaultValue="profile" className="flex flex-col flex-grow w-full h-full space-y-10">
                <div className="flex flex-grow flex-col m-6 ml-12 h-full">
                    <div className="flex flex-row">
                        <TabsList className="flex flex-[4] justify-start relative border-b border-gray-300 bg-transparent rounded-none w-full p-0">
                            <TabsTrigger value="profile" className="relative text-lg font-medium group">
                                Profile
                                <span className="absolute left-0 bottom-0 w-full h-1 group-hover:bg-purple-500 group-data-[state=active]:bg-purple-500 transition-all"></span>
                            </TabsTrigger>

                            <TabsTrigger value="settings" className="relative text-lg font-medium group">
                                Settings
                                <span className="absolute left-0 bottom-0 w-full h-1 group-hover:bg-purple-500 group-data-[state=active]:bg-purple-500 transition-all"></span>
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex flex-[2]"></div>
                    </div>

                    {/* Profile Tab Content */}
                    <TabsContent value="profile">
                        <Profile />
                    </TabsContent>

                    {/* Settings Tab Content */}
                    <TabsContent value="settings" className="h-full">
                        <Setting />
                    </TabsContent>
                </div>
            </Tabs>
        </>
    )
}

export default AccountSetting
