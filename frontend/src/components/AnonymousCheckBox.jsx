import { Checkbox } from "@/components/ui/checkbox"

export function AnonymousCheckBox({ formData, handleChange }) {
  return (
    <div className="items-top flex space-x-2 border border-gray-300 dark:border-gray-700 rounded-lg p-4 max-w-lg">
      <Checkbox id="anonymous" onCheckedChange= {() => {handleChange(!formData['anonymous'], 'anonymous')}}/>
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium text-black dark:text-gray-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Anonymous Review
        </label>
        <p className="text-sm text-gray-800 dark:text-gray-400">
            Your name and profile will be hidden from readers, but visible to admins. 
            Any policy violations may result in an account ban.
        </p>
      </div>
    </div>
  )
}
