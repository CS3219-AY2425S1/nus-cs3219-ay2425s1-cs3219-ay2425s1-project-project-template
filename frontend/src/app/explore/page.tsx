import MatchingFilters from "./components/MatchingFilters";

export default function Page() {
    return (
        <section className="flex flex-grow justify-center">
            <div className="flex-col h-full py-12 w-5/6 2xl:w-3/5">
                <div className="border-2">
                    <MatchingFilters />
                </div>
                <div className="flex flex-grow">
                    <div className="w-2/3 border-2">Questions</div>
                    <div className="flex-1 border-2">Suggested</div>
                </div>
            </div>
        </section>
    )
}
