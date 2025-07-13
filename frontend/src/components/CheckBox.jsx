import { Checkbox } from "@/components/ui/checkbox"

export function CheckBox({ formData, handleChange }) {
  return (
    <div className="items-top flex space-x-2 border border-gray-600 rounded-lg p-4 max-w-lg">
      <Checkbox id="anonymous" onCheckedChange= {() => {handleChange(!formData['anonymous'], 'anonymous')}}/>
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Anonymous Review
        </label>
        <p className="text-sm text-zinc-500">
            Your name and profile will be hidden from readers, but visible to admins. 
            Any policy violations may result in an account ban.
        </p>
      </div>
    </div>
  )
}
