import CustomTabs from '@/components/customs/custom-tabs'
import { ITestcase } from '@/types'
import { useState } from 'react'

export default function TestcasesTab({ testcases }: { testcases: ITestcase[] }) {
    const [activeTestcaseIdx, setActiveTestcaseIdx] = useState(testcases[0].idx)

    const activeTestcase = (idx: number) => {
        return testcases.find((testcase) => testcase.idx === idx)
    }
    return (
        <div>
            <CustomTabs
                tabs={testcases.map((testcase) => `Case ${testcase.idx}`)}
                handleActiveTabChange={(tab) => setActiveTestcaseIdx(parseInt(tab.split(' ')[1]))}
                type="label"
                size="label"
            />
            <div key={activeTestcaseIdx} className="flex flex-col gap-2 text-sm">
                <span className="mt-2">{activeTestcase(activeTestcaseIdx)?.inputVar} =</span>
                <span className="px-2 py-1 rounded-lg bg-slate-100">{activeTestcase(activeTestcaseIdx)?.input}</span>
                <span className="mt-2">Expected output = </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100">
                    {activeTestcase(activeTestcaseIdx)?.expectedOutput}
                </span>
            </div>
        </div>
    )
}
