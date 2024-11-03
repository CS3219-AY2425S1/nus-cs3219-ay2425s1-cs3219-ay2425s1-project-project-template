import { Select } from "@/components/ui/select"
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlayIcon } from "lucide-react"

const CodeEditorContainer = () => {
  return (
    <><div className="flex items-center justify-between">
      <Select>
        <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-transparent focus:ring-offset-0">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="bg-black text-white">
        <PlayIcon className="h-4 w-4 mr-2" />
        Run Code
      </Button>
    </div><Card className="h-1/2 max-h-[60vh] my-3 overflow-hidden">
        <pre className="bg-muted h-full p-4 py-2 rounded-md overflow-auto text-sm">
          <code className="h-full">{`1
2 
3 
4 
5
6
7
8
9
10
11
12
13
14
`}</code>
        </pre>
      </Card></>
  )
}

export default CodeEditorContainer
