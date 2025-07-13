import { Card, CardContent } from "@/components/ui/card"
import { Code, Mail, Shield } from "lucide-react"
import MascotCallLight from "@/assets/mascot/MascotCallLight.png"
import MascotCallDark from "@/assets/mascot/MascotCallDark.png"
import GautamImage from "@/assets/Gautam.png"
import AdityaImage from "@/assets/Aditya.png"
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { useTheme } from "@/context/ThemeContext";

export default function AboutPage() {
  const { theme } = useTheme();
  const mascotSrc = theme === "dark" ? MascotCallDark : MascotCallLight;

  return (
    <div className="min-h-screen bg-white dark:bg-[#161616] text-black dark:text-white">
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Our Vision Section */}
        <section className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">Our Vision</h1>
          <p className="text-lg text-black dark:text-gray-300">
            We are dedicated to creating a platform that empowers developers to build, collaborate, and innovate without
            limitations. Our mission is to provide intuitive tools that simplify complex workflows, enabling teams to
            focus on what truly matters - creating exceptional software that makes a difference in the world.
          </p>
        </section>

        <section className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">Meet the Devs</h1>
          <div className="grid md:grid-cols-2 gap-8">
            {devs.map((dev, index) => (
              <Card key={index} className="bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-800">
                <CardContent className="p-8">
                <div className="flex flex-col gap-4 items-center">
                  <img src={dev.image} alt={dev.name} className="w-80" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl text-black dark:text-white font-semibold">{dev.name}</h3>
                    <p className="text-black dark:text-gray-300 text-md">{dev.bio}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-start mt-8 -mb-4 text-zinc-800 dark:text-zinc-300">
                  <div className="flex flex-col items-center justify-between">
                    <div className="flex flex-wrap justify-center lg:gap-x-16">
                      {dev.socials.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative flex flex-col items-center min-w-[60px] group"
                        >
                          <div className={`transition-transform duration-300 group-hover:rotate-[20deg] ${dev.lightcolor} dark:${dev.darkcolor}`}>
                            {link.icon}
                          </div>
                          <span className={`mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-bold ${dev.lightcolor} dark:${dev.darkcolor}`}>
                            {link.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                </CardContent>
              </Card>
            ))}
          </div>
      </section>


        <section className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">Join Us</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex gap-6 items-start">
                  <div className="bg-purple-100 dark:bg-gray-800 p-4 rounded-full">
                    <Code className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl text-black dark:text-white font-semibold">Programmers</h3>
                    <p className="text-black dark:text-gray-300">
                    As a programmer, you'll fix bugs, implement new features, enhance UI/UX, and maintain the GitHub repository. Contribute to a platform used by students while gaining hands-on experience in web development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex gap-6 items-start">
                  <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-full">
                    <Shield className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl text-black dark:text-white font-semibold">Moderators</h3>
                    <p className="text-black dark:text-gray-300">
                    As a moderator, you'll ensure a respectful community by reviewing content, handling policy violations and addressing repeat offenders. Help us maintain a safe and constructive environment for all users.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <img
              src={mascotSrc}
              alt="Contact Us"
              className="rounded-lg w-60 h-60 md:w-72 md:h-72 object-cover transition-opacity duration-300"
            />

            <div className="space-y-6 max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight mt-4">Contact Us</h2>
              <p className="text-black dark:text-gray-300 text-lg">
                We'd love to hear from you! Whether you want to collaborate, provide feedback, or just say hello, our
                inbox is always open. We strive to respond to all messages within 24 hours.
              </p>
              <a
                href="mailto:team@courselect.org"
                className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-200 group text-lg"
              >
                <Mail className="group-hover:text-cyan-500 dark:group-hover:text-cyan-200" />
                <span className="hover:underline">team@courselect.org</span>
              </a>
            </div>
            
          </div>
        </section>
      </div>
    </div>
  )
}

const devs = [
  {
    name: "Aditya Aggarwal",
    image: AdityaImage,
    bio: "I'm an AI engineer, specializing in NLP with a knack for building real-world applications. I have experience in full-stack development with React, Node.js and SQL. When not coding, you'll find me at the chessboard or the ping pong table!",
    socials : [
      { id: 1, icon: <FaEnvelope size={25} />, name: 'Email', url: 'mailto:aditya22028@iiitd.ac.in' },
      { id: 2, icon: <FaLinkedin size={25} />, name: 'LinkedIn', url: 'https://linkedin.com/in/adityaaggarwal07' },
      { id: 3, icon: <FaGithub size={25} />, name: 'GitHub', url: 'https://github.com/AyTIDa1165' },
    ],
    lightcolor: "group-hover:text-emerald-500",
    darkcolor: "group-hover:text-emerald-300",
  },
  {
    name: "Gautam Singh",
    image: GautamImage,
    bio: "I'm a developer focused on Full-Stack Development, DevOps, GenAI, and Web3. I enjoy building reliable systems and working in production environments. Outside of tech, I’m either on the basketball court or at the piano.",
    socials : [
      { id: 1, icon: <FaEnvelope size={25} />, name: 'Email', url: 'mailto:gautam22188@iiitd.ac.in' },
      { id: 2, icon: <FaLinkedin size={25} />, name: 'LinkedIn', url: 'https://www.linkedin.com/in/gautamsingh28' },
      { id: 3, icon: <FaGithub size={25} />, name: 'GitHub', url: 'https://github.com/gautam1228' },
    ],
    lightcolor: "group-hover:text-cyan-500",
    darkcolor: "group-hover:text-cyan-300",
  }
];
