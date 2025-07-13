import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeyRound, Mail, Info } from 'lucide-react';
import { PasswordInput } from '@/components/ui/password-input';
import axios from 'axios';
import { CONFIG } from '@/Config';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { branches, years } from "@/utils/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const getPasswordStrength = (password) => {
  if (!password || password.includes(" ")) return 0;

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  let score = 0;
  if (hasLetter && isLongEnough) score++;
  if (hasUpper) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  return score;
};

export const RegisterPage = () => {
  
  const backendUrl = CONFIG.backendUrl;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    branch: '',
    batch: '',
    readGuidelines: false
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const strength = getPasswordStrength(formData.password);
    
    if (!formData.password || formData.password.includes(" ")) {
      toast.error("Invalid password!");
      return;
    }
    
    if (strength < 4) {
      toast.error("Password is not strong enough!");
      return;
    }

    if (!formData.readGuidelines) {
      toast.warning("Please confirm you've read the community guidelines!");
      return;
    }

    if(!formData.email.endsWith("@iiitd.ac.in")){
      toast.warning("Only IIIT-Delhi email addresses are allowed to register.");
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/v1/auth/register`, {
        branch : formData.branch,
        email : formData.email,
        password : formData.password,
        batch : formData.batch
      });
  
      if (data.success) {
        toast.success(data.message);
        navigate("/verify");
      } else {
        toast.error(data.message);
      }
  
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        handleError(error, navigate);
      }
    }
  }

  if(loading){
    return <LoadingSkeleton />
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#161616]">
      <div className="w-full max-w-md bg-white dark:bg-[#1c1c1c] border border-gray-300 dark:border-0 rounded-lg shadow-md p-8">
        <h2 className="text-center text-3xl font-extrabold text-black dark:text-gray-100 mb-4">Sign Up</h2>
        <p className="text-black dark:text-gray-300 mb-6 text-center">Please fill in your details to create an account.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="branches" className="text-sm font-medium text-black dark:text-gray-200">Branch</Label>
              <Select onValueChange={(value) => 
                setFormData((prevState) => ({
                  ...prevState,
                  ['branch']: value,
              }))}>
                <SelectTrigger id="branch" className="py-2 border-gray-300 focus:outline-none font-medium text-black dark:text-gray-200">
                  <SelectValue placeholder="Select your branch"/>
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.name} value={branch.code}>
                      {`${branch.name} (${branch.code})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batch" className="text-sm font-medium text-black dark:text-gray-200">Batch</Label>
              <Select onValueChange={(value) => 
                setFormData((prevState) => ({
                  ...prevState,
                  ['batch']: value,
              }))}>
                <SelectTrigger id="batch" className="py-2 border-gray-300 focus:outline-none font-medium text-black dark:text-gray-200">
                  <SelectValue placeholder="Select your Batch Year"/>
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-black dark:text-gray-200">
                Email address
              </label>
              <div className="relative flex items-center mt-1">
                <div className="absolute left-3 pl-2 pr-5 border-r border-gray-300 z-10">
                  <Mail className="w-5 h-5 text-gray-500"/>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your IIITD email address"
                  required
                  className="bg-zinc-100 dark:bg-zinc-700/60 text-black dark:text-gray-200 w-full pl-20 px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:border-gray-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-black dark:text-gray-200">
                Password
              </label>
              <div className="relative flex items-center mt-1">
                <div className="absolute left-3 pl-2 pr-5 border-r border-gray-300 z-10">
                  <KeyRound className="w-5 h-5 text-gray-500"/>
                </div>
                <PasswordInput
                  id="password"
                  name="password" 
                  placeholder="Enter your password"
                  required
                  className="bg-zinc-100 dark:bg-zinc-700/60 text-black dark:text-gray-200 w-full pl-20 px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center items-center gap-2 mt-6 relative">
                <div className="flex gap-2 w-full max-w-xs">
                  {[...Array(4)].map((_, index) => {
                    let color = "bg-zinc-600";
                    if (passwordStrength > index) {
                      if (passwordStrength === 1) color = "bg-red-500";
                      else if (passwordStrength === 2) color = "bg-orange-400";
                      else if (passwordStrength === 3) color = "bg-yellow-400";
                      else if (passwordStrength === 4) color = "bg-green-400";
                    }
                    return (
                      <div
                        key={index}
                        className={`h-1.5 flex-1 transition-all duration-300 ${color}`}
                      />
                    );
                  })}
                </div>

                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Info className="w-4 h-4 text-gray-700 dark:text-gray-400 cursor-pointer" />
                  {showTooltip && (
                    <div className="absolute left-0 top-6 z-20 w-64 p-3 rounded-md border-[1px] bg-gray-300/70 border-black dark:border-gray-500 dark:bg-zinc-800 text-black dark:text-gray-100 text-sm shadow-lg">
                      <ul className="list-disc pl-4 space-y-1">
                        <li>No spaces allowed</li>
                        <li>At least 8 characters</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="guidelines" onCheckedChange= {() => setFormData((prev) => ({ ...prev, readGuidelines: !prev.readGuidelines }))}/>
              <label htmlFor="guidelines" className="text-md text-black dark:text-gray-200">
                I have read the{" "}
                <Link to="/guidelines" className="text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-2 hover:text-cyan-500 dark:hover:text-cyan-200">
                  community guidelines
                </Link>
              </label>
            </div>
      
            <div className='flex justify-center'>
              <Button type="submit" className="w-1/2 mt-4">Sign Up</Button>
            </div>
        </form>
        <div className='flex justify-center mb-2 pt-6 gap-2'>
          <p className="text-black dark:text-gray-300">Already have an account ?</p>
          <Link to="/login" className='text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-2 hover:text-cyan-500 dark:hover:text-cyan-200'>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}