import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Profile from './Profile'
import Setting from './Setting'
import SettingDelete from './SettingDelete'

const ProfileSettings = () => {
    return (
        <>
            <div className="flex flex-grow">
                <div className="flex flex-[4] m-6 ml-12">
                    <Tabs defaultValue="profile" className="box w-full h-full space-y-10">
                        <div className="flex flex-row">
                            <TabsList className="flex justify-start relative border-b border-gray-300 bg-transparent rounded-none w-full p-0">
                                <TabsTrigger value="profile" className="relative text-lg font-medium group">
                                    Profile
                                    <span className="absolute left-0 bottom-0 w-full h-1 group-hover:bg-purple-500 group-data-[state=active]:bg-purple-500 transition-all"></span>
                                </TabsTrigger>

                                <TabsTrigger value="settings" className="relative text-lg font-medium group">
                                    Settings
                                    <span className="absolute left-0 bottom-0 w-full h-1 group-hover:bg-purple-500 group-data-[state=active]:bg-purple-500 transition-all"></span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Profile Tab Content */}
                        <TabsContent value="profile">
                            <Profile />
                        </TabsContent>

                        {/* Settings Tab Content */}
                        <TabsContent value="settings">
                            <Setting />
                            <SettingDelete />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="flex flex-[2]"></div>
            </div>
        </>
    )
}

export default ProfileSettings
