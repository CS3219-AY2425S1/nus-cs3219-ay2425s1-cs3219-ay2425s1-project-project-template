import CodePage from "./CodePage";
import ChatPage from "./ChatPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RightPage = () => {

  return (
    <Tabs defaultValue="code" className="p-4">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      <TabsContent value="code"><CodePage/></TabsContent>
      <TabsContent value="chat"><ChatPage/></TabsContent>
    </Tabs>
  );
};

export default RightPage;