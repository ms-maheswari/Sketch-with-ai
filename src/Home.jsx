import React, { useState } from 'react'
import Navbar from './Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiArrowLineDown } from "react-icons/pi";
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = ({ theme, setTheme }) => {


  // ✅ Fixed typos in options
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
     { value: 'react-tailwind', label: 'React.js + Tailwind CSS' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Extract code safely
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // ⚠️ API Key 
  const ai = new GoogleGenAI({
    apiKey: process.env.REACT_APP_GEMINI_API_KEY 
    
  });

  // ✅ Generate code
  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  // ✅ Download Code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme}/>

      {/* ✅ Better responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
        {/* Left Section */}
        <div className={`w-full py-6 rounded-xl  mt-5 p-5  ${theme === "dark" ? "bg-gray-900 rounded-xl " : "bg-gray-100 text-black  rounded-lg"}` }>
          <h3 className='text-[25px] font-semibold sp-text'>Design your components with AI</h3>
          <p className='text-gray-400 mt-2 text-[16px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
       <Select
  className="mt-2"
  options={options}
  value={frameWork}
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#2d3748" : "#f5f5f5",
      borderColor: theme === "dark" ? "#333" : "#ccc",
      color: theme === "dark" ? "#fff" : "#000",
      boxShadow: "none",
      "&:hover": {
        borderColor: theme === "dark" ? "#555" : "#999",
      }
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#424e58" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? theme === "dark"
          ? "#545962ff"
          : "#e0e0e0"
        : state.isFocused
        ? theme === "dark"
          ? "#0d161eff"
          : "#f0f0f0"
        : theme === "dark"
        ? "#424e58"
        : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      "&:active": {
        backgroundColor: theme === "dark" ? "#444" : "#ddd",
      }
    }),

    singleValue: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#000",
    }),

    placeholder: (base) => ({
      ...base,
      color: theme === "dark" ? "#aaa" : "#666",
    }),

    input: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#000",
    }),
  }}
  onChange={(selected) => setFrameWork(selected)}
/>


          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className={`w-full min-h-[200px]  rounded-xl  mt-3 p-3 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none  ${theme === "dark" ? "bg-gray-800 rounded-xl " : "bg-gray-200 text-black  rounded-lg"}`}
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
           
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-green-400 to-blue-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95"
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className={` relative mt-5 w-full h-[80vh]  rounded-xl overflow-hidden  ${theme === "dark" ? "bg-gray-900 rounded-xl " : "bg-gray-100 text-black  rounded-lg"}`}>
          {
            !outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center">
                <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-green-400 to-blue-600">
                  <HiOutlineCode />
                </div>
                <p className='text-[16px] text-gray-400 mt-3'>Your component & code will appear here.</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className={` w-full h-[50px] flex items-center gap-3 px-3 ${theme}==='dark'? 'bg-gray-900' : 'bg-gray-100'`}>
                 <button
          onClick={() => setTab(1)}
          className={`w-1/2 py-2 rounded-lg transition-all 
          ${tab === 1 
            ? theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-600 text-white" 
            : theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-black"
          }`}
        > Code </button>
                  <button
          onClick={() => setTab(2)}
          className={`w-1/2 py-2 rounded-lg transition-all 
          ${tab === 2 
            ? theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-600 text-white" 
            : theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-black"
          }`}
        > Preview </button>
                </div>

                {/* Toolbar */}
                <div className={`w-full h-[50px] flex items-center justify-between px-4 ${theme}==='dark' ? 'bg-gray-800' : 'text-black'`}>
                  <p className='font-bold text-gray-500'>Code Editor</p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button onClick={copyCode} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><IoCopy /></button>
                        <button onClick={downnloadFile} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><PiArrowLineDown /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setIsNewTabOpen(true)} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><ImNewTab /></button>
                        <button onClick={() => setRefreshKey(prev => prev + 1)} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><FiRefreshCcw /></button>
                      </>
                    )}
                  </div>
                </div>

                {/* Editor / Preview */}
                <div className="h-full">
                  {tab === 1 ? (
                    <Editor value={code} height="100%"
                   theme={theme === "dark" ? "vs-dark" : "vs-light"}
                  
                    language="html" />
                  ) : (
                    <iframe key={refreshKey} 
                    title="code-preview" srcDoc={code} className={`w-full h-full  ${theme} === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-900' `}></iframe>
                  )}
                </div>
              </>
            )
          }
        </div>
      </div>

      {/* ✅ Fullscreen Preview Overlay */}
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
              <IoCloseSharp />
            </button>
          </div>
          <iframe  title="live-preview" srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </>
  )
}

export default Home
