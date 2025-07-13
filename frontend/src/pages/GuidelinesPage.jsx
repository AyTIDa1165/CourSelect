import { Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { guidelines } from "@/utils/constants"

export default function CommunityGuidelines() {
  return (
    <div className="bg-white dark:bg-[#161616]">
      <div className="bg-white dark:bg-[#161616] container mx-auto py-10 px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-black dark:text-white">
            Community Guidelines
          </h1>
          <p className="text-gray-800 dark:text-gray-400 max-w-2xl text-lg mx-auto">
            Our guidelines help maintain a respectful, trustworthy, and constructive environment.
          </p>
        </div>

        <div className="grid gap-8">
          {guidelines.map((section, index) => (
            <Card key={index} className="bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black dark:text-white">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-black dark:text-gray-300/90">
                <ul className="list-disc pl-6 space-y-4">
                  {section.content.map((para, i) => (
                    <li key={i} className="text-black dark:text-gray-300">
                      {para}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-start gap-4">
          <Info className="h-5 w-5 text-gray-800 dark:text-gray-300/80 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-800 dark:text-gray-300/80">
              By participating, you agree to follow the guidelines and accept consequences for any violations.
          </p>
        </div>
      </div>
    </div>
  );
}
