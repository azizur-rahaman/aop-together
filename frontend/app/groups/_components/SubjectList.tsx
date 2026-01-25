import { Biohazard, Book, Laptop, PersonStanding, PlusIcon, SquareSigma } from "lucide-react"

import { Button } from "@/components/ui/button"


export type Subject = {
  name: string,
  icon: string
}


interface SubjectsListProps {
  subjects: Subject[]
  selectedSubject: string | null
  onSelect: (subject: string | null) => void
}

export function SubjectList({ subjects, selectedSubject, onSelect }: SubjectsListProps) {
  const activeClass = "rounded-full bg-[#4F6EF7] text-white hover:bg-[#4F6EF7]/90 border-transparent font-medium shadow-sm transition-all";
  const inactiveClass = "rounded-full bg-white text-slate-600 border border-slate-200 hover:border-[#4F6EF7]/50 hover:text-[#4F6EF7] transition-all";

  return (
    <div className="flex flex-col items-start gap-8">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedSubject === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(null)}
          className={selectedSubject === null ? activeClass : inactiveClass}
        >
          All Subjects
        </Button>

        {subjects.map((subject, index) => (
          <Button
            key={index}
            variant={selectedSubject === subject.name ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(subject.name)}
            className={selectedSubject === subject.name ? activeClass : inactiveClass}
          >
            <span className="inline-flex mr-2" dangerouslySetInnerHTML={{ __html: subject.icon }} />
            {subject.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
